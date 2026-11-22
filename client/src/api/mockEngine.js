import initialAssumptions from '../data/seed/assumptions.json';
import initialEnquiries from '../data/seed/enquiries.json';
import initialEvidence from '../data/seed/evidence.json';
import initialPlants from '../data/seed/plants.json';
import initialProfiles from '../data/seed/profiles.json';
import initialWasteProfiles from '../data/seed/wasteProfiles.json';

const STORAGE_KEY = 'biogas_store_v1';

function getStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.plants && parsed.profiles && parsed.assumptions) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse mock store from localStorage', e);
  }

  const initial = {
    assumptions: initialAssumptions,
    enquiries: initialEnquiries,
    evidence: initialEvidence,
    plants: initialPlants,
    profiles: initialProfiles,
    wasteProfiles: initialWasteProfiles,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch (err) {
    console.error('Failed to initialize mock store in localStorage', err);
  }

  return initial;
}

function saveStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.error('Failed to save mock store to localStorage', err);
  }
}

function calculateCompleteness(plant, plantEvidence) {
  let score = 0;
  const missingItems = [];

  if (plant.supportedFeedstock && plant.supportedFeedstock.length > 0) score += 10;
  else missingItems.push('Supported feedstocks not specified');

  if (plant.serviceArea && plant.serviceArea.length > 0) score += 10;
  else missingItems.push('Service area boundaries not specified');

  const isOmProvided =
    plant.omOffering &&
    !plant.omOffering.toLowerCase().includes('not provided') &&
    !plant.omOffering.toLowerCase().includes('not verified');
  if (isOmProvided) score += 15;
  else missingItems.push('O&M servicing agreement not specified');

  const isWarrantyProvided =
    plant.warranty &&
    !plant.warranty.toLowerCase().includes('not provided') &&
    !plant.warranty.toLowerCase().includes('unverified');
  if (isWarrantyProvided) score += 15;
  else missingItems.push('Structural & mechanical warranty not specified');

  const hasProject = plantEvidence.some((e) => e.type === 'project example' && e.status === 'provided');
  if (hasProject) score += 20;
  else missingItems.push('No verified project case study provided');

  const hasCommissioning = plantEvidence.some((e) => e.type === 'commissioning' && e.status === 'provided');
  if (hasCommissioning) score += 20;
  else missingItems.push('No third-party commissioning or safety sign-off provided');

  const hasReference = plantEvidence.some((e) => e.type === 'reference' && e.status === 'provided');
  if (hasReference) score += 10;
  else missingItems.push('No client operational reference letter provided');

  return {
    percentage: Math.min(score, 100),
    missingItems,
    isFullyVerified: missingItems.length === 0,
  };
}

function assessFeedstock(input = {}) {
  const {
    wasteType,
    quantityKg,
    quantityMinKg,
    quantityMaxKg,
    frequency = 'daily',
    siteConstraints = '',
    location = '',
  } = input;

  const isWasteTypeUncertain = !wasteType || wasteType === 'not sure' || wasteType === 'assessment_required';
  const isQuantityUncertain =
    input.quantityUncertain ||
    (!quantityKg && (!quantityMinKg || !quantityMaxKg)) ||
    input.quantityRange === 'not sure';

  const uncertainFields = [];
  if (isWasteTypeUncertain) uncertainFields.push('Feedstock classification / waste type');
  if (isQuantityUncertain) uncertainFields.push('Daily / weekly organic mass (kg)');
  if (!location || location === 'not sure') uncertainFields.push('Physical location (service area)');

  if (isWasteTypeUncertain || isQuantityUncertain) {
    return {
      status: 'assessment_required',
      badge: 'Assessment required',
      headline: 'Assessment required: Baseline data incomplete',
      uncertainFields,
      explanation:
        'Biogas yields and energy conversion cannot be reliably estimated without measured feedstock mass or biological classification. Defaulting to speculative numbers would produce misleading planning metrics.',
      recommendation:
        'We recommend logging waste bin counts over 7–14 days or requesting an on-site waste characterization audit from a local anaerobic digestion provider.',
      illustrative: true,
      evidenceSummary: {
        source: 'ADBA / WRAP Feedstock Protocol',
        caveat: 'Physical survey or lab biochemical methane potential (BMP) test required for unclassified streams.',
      },
    };
  }

  const store = getStore();
  const assumption = (store.assumptions || []).find(
    (a) => a.wasteType.toLowerCase() === wasteType.toLowerCase()
  );

  if (!assumption) {
    return {
      status: 'assessment_required',
      badge: 'Assessment required',
      headline: `Assessment required: No baseline assumption for "${wasteType}"`,
      uncertainFields: ['Documented feedstock conversion coefficient'],
      explanation: `No peer-reviewed or standard conversion benchmark currently exists in the platform database for "${wasteType}".`,
      recommendation:
        'Submit a feedstock sample for laboratory biochemical methane potential (BMP) testing or consult a specialized plant engineer.',
      illustrative: true,
      evidenceSummary: {
        source: 'Platform Benchmark Database',
        caveat: 'Only feedstocks with published experimental benchmarks produce range outputs.',
      },
    };
  }

  let minDailyKg = 0;
  let maxDailyKg = 0;

  if (quantityKg) {
    const val = Number(quantityKg);
    minDailyKg = Math.round(val * 0.85);
    maxDailyKg = Math.round(val * 1.15);
  } else if (quantityMinKg && quantityMaxKg) {
    minDailyKg = Number(quantityMinKg);
    maxDailyKg = Number(quantityMaxKg);
  } else if (typeof input.quantityRange === 'string') {
    const numbers = input.quantityRange.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      minDailyKg = Number(numbers[0]);
      maxDailyKg = Number(numbers[1]);
    } else if (numbers && numbers.length === 1) {
      minDailyKg = Math.round(Number(numbers[0]) * 0.85);
      maxDailyKg = Math.round(Number(numbers[0]) * 1.15);
    }
  }

  if (frequency && frequency.toLowerCase().includes('week')) {
    minDailyKg = Math.round((minDailyKg / 7) * 10) / 10;
    maxDailyKg = Math.round((maxDailyKg / 7) * 10) / 10;
  }

  const yieldRateMinPerKg = assumption.yieldMin / 1000;
  const yieldRateMaxPerKg = assumption.yieldMax / 1000;

  const minDailyBiogasM3 = Math.round(minDailyKg * yieldRateMinPerKg * 10) / 10;
  const maxDailyBiogasM3 = Math.round(maxDailyKg * yieldRateMaxPerKg * 10) / 10;

  const minAnnualBiogasM3 = Math.round(minDailyBiogasM3 * 365);
  const maxAnnualBiogasM3 = Math.round(maxDailyBiogasM3 * 365);

  const thermalMultiplierKWh = 6.0;
  const minThermalDailyKWh = Math.round(minDailyBiogasM3 * thermalMultiplierKWh * 10) / 10;
  const maxThermalDailyKWh = Math.round(maxDailyBiogasM3 * thermalMultiplierKWh * 10) / 10;

  const minLpgEquivalentKgDay = Math.round((minDailyBiogasM3 / 1.9) * 10) / 10;
  const maxLpgEquivalentKgDay = Math.round((maxDailyBiogasM3 / 1.9) * 10) / 10;

  return {
    status: 'calculated_range',
    badge: 'Indicative Yield Range',
    wasteType: assumption.wasteType,
    category: assumption.category,
    inputSummary: {
      dailyKgRange: `${minDailyKg} – ${maxDailyKg} kg/day`,
      frequency,
      location: location || 'Not provided / Not verified',
      siteConstraints: siteConstraints || 'Not provided',
    },
    dailyBiogas: {
      min: minDailyBiogasM3,
      max: maxDailyBiogasM3,
      unit: 'm³ biogas / day',
    },
    annualBiogas: {
      min: minAnnualBiogasM3,
      max: maxAnnualBiogasM3,
      unit: 'm³ biogas / year',
    },
    thermalEnergy: {
      min: minThermalDailyKWh,
      max: maxThermalDailyKWh,
      unit: 'kWh / day thermal equivalent',
      note: 'Based on 6.0 kWh/m³ gross calorific value at 60% CH4 concentration.',
    },
    lpgDisplacement: {
      min: minLpgEquivalentKgDay,
      max: maxLpgEquivalentKgDay,
      unit: 'kg LPG / day equivalent',
      note: 'Thermal substitution benchmark for commercial kitchen burners.',
    },
    assumptions: {
      wasteType: assumption.wasteType,
      yieldRange: `${assumption.yieldMin} – ${assumption.yieldMax} m³ / tonne`,
      methaneConcentration: assumption.methaneConcentration || '55% - 65% CH4',
      source: assumption.source,
      date: assumption.date,
      caveat: assumption.caveat,
    },
    illustrative: true,
  };
}

function findMatchingPlants(criteria = {}) {
  const { wasteType, location = '', quantityKg } = criteria;
  const store = getStore();
  const allPlants = store.plants || [];
  const allEvidence = store.evidence || [];

  const results = allPlants.map((plant) => {
    const plantEv = allEvidence.filter((e) => e.plantId === plant.id);
    const providedCount = plantEv.filter((e) => e.status === 'provided').length;
    const pendingCount = plantEv.filter((e) => e.status === 'pending').length;
    const missingCount = plantEv.filter((e) => e.status === 'missing').length;

    let feedstockMatch = false;
    if (!wasteType || wasteType === 'not sure') {
      feedstockMatch = true;
    } else {
      const wtLower = wasteType.toLowerCase();
      feedstockMatch = plant.supportedFeedstock.some((sf) => {
        const sfLower = sf.toLowerCase();
        return (
          sfLower.includes(wtLower) ||
          wtLower.includes(sfLower) ||
          (wtLower.includes('food') && sfLower.includes('food')) ||
          (wtLower.includes('scraps') && sfLower.includes('organic')) ||
          (wtLower.includes('slurry') && sfLower.includes('slurry')) ||
          (wtLower.includes('grain') && sfLower.includes('grain'))
        );
      });
    }

    let areaMatch = false;
    if (!location || location === 'not sure') {
      areaMatch = true;
    } else {
      const locLower = location.toLowerCase();
      areaMatch = plant.serviceArea.some((sa) => {
        const saLower = sa.toLowerCase();
        return (
          saLower.includes(locLower) ||
          locLower.includes(saLower) ||
          (locLower.includes('bristol') && saLower.includes('bristol')) ||
          (locLower.includes('bath') && (saLower.includes('bath') || saLower.includes('somerset'))) ||
          saLower.includes('south west')
        );
      });
    }

    let capacityMatch = true;
    if (quantityKg) {
      const q = Number(quantityKg);
      capacityMatch = q >= plant.capacityMin * 0.7 && q <= plant.capacityMax * 1.5;
    }

    let matchScore = 0;
    const matchReasons = [];

    if (feedstockMatch) {
      matchScore += 40;
      matchReasons.push(`Supports ${wasteType || 'this feedstock stream'}`);
    }
    if (areaMatch) {
      matchScore += 40;
      matchReasons.push(`Active coverage in ${location || 'your region'}`);
    }
    if (capacityMatch && quantityKg) {
      matchScore += 20;
      matchReasons.push(`Rated for ${plant.capacityMin}–${plant.capacityMax} ${plant.capacityUnit}`);
    }

    const isMatch = feedstockMatch || areaMatch;

    return {
      ...plant,
      isMatch,
      matchScore,
      matchReasons,
      evidenceSummary: {
        total: plantEv.length,
        provided: providedCount,
        pending: pendingCount,
        missing: missingCount,
        hasMissingEvidence: missingCount > 0,
      },
    };
  });

  const sortedMatches = results
    .filter((p) => p.isMatch)
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return b.evidenceSummary.provided - a.evidenceSummary.provided;
    });

  return {
    totalEvaluated: allPlants.length,
    matchedCount: sortedMatches.length,
    matches: sortedMatches,
    criteria: {
      wasteType: wasteType || 'Not specified',
      location: location || 'Not specified',
      quantityKg: quantityKg || 'Not specified',
    },
    illustrative: true,
  };
}

function comparePlants(plantIds = []) {
  const store = getStore();
  const allPlants = store.plants || [];
  const allEvidence = store.evidence || [];

  const comparedPlants = plantIds.slice(0, 3).map((id) => {
    const plant = allPlants.find((p) => p.id === id);
    if (!plant) {
      return {
        id,
        found: false,
        error: `Plant provider ${id} not found`,
      };
    }

    const plantEv = allEvidence.filter((e) => e.plantId === id);

    const projectExample = plantEv.find((e) => e.type === 'project example') || {
      status: 'missing',
      title: 'Not provided / Not verified',
      source: 'Not provided',
    };

    const commissioning = plantEv.find((e) => e.type === 'commissioning') || {
      status: 'missing',
      title: 'Not provided / Not verified',
      source: 'Not provided',
    };

    const reference = plantEv.find((e) => e.type === 'reference') || {
      status: 'missing',
      title: 'Not provided / Not verified',
      source: 'Not provided',
    };

    const isWarrantyMissing =
      !plant.warranty ||
      plant.warranty.toLowerCase().includes('not provided') ||
      plant.warranty.toLowerCase().includes('not verified');

    const isOmMissing =
      !plant.omOffering ||
      plant.omOffering.toLowerCase().includes('not provided') ||
      plant.omOffering.toLowerCase().includes('not verified');

    const providedCount = plantEv.filter((e) => e.status === 'provided').length;
    const pendingCount = plantEv.filter((e) => e.status === 'pending').length;
    const missingCount = plantEv.filter((e) => e.status === 'missing').length;

    return {
      id: plant.id,
      organisation: plant.organisation,
      scale: plant.scale,
      capacityRange: `${plant.capacityMin} – ${plant.capacityMax} ${plant.capacityUnit}`,
      serviceArea: plant.serviceArea,
      supportedFeedstock: plant.supportedFeedstock,
      services: plant.services,
      statedOmOffering: plant.omOffering,
      isOmMissing,
      statedWarranty: plant.warranty,
      isWarrantyMissing,
      evidenceSummary: {
        total: plantEv.length,
        provided: providedCount,
        pending: pendingCount,
        missing: missingCount,
      },
      evidenceDetails: {
        projectExample,
        commissioning,
        reference,
      },
      continuityRisk:
        plant.scale === 'small'
          ? 'Requires internal thermal insulation or auxiliary heating in winter temperatures below 5°C.'
          : 'High thermal inertia; daily feedstock loading protocol required to avoid biological acidification.',
    };
  });

  return {
    totalCompared: comparedPlants.length,
    plants: comparedPlants,
    comparisonFields: [
      { key: 'organisation', label: 'Organisation' },
      { key: 'scale', label: 'Digester Scale' },
      { key: 'capacityRange', label: 'Feedstock Capacity' },
      { key: 'serviceArea', label: 'Service Coverage' },
      { key: 'statedOmOffering', label: 'O&M Agreement' },
      { key: 'statedWarranty', label: 'Warranty Coverage' },
      { key: 'commissioning', label: 'Commissioning Certification' },
      { key: 'reference', label: 'Customer Operational Reference' },
      { key: 'projectExample', label: 'Demonstrated Project Example' },
    ],
    illustrative: true,
  };
}

/**
 * Main mock dispatcher handling all API routes
 */
export async function handleMockRequest(endpoint, options = {}, activeProfileId = 'waste-restaurant-1') {
  // Artificial mini-delay to simulate async execution
  await new Promise((resolve) => setTimeout(resolve, 30));

  const cleanEndpoint = endpoint.replace(/^\/?api\/?/, '/');
  const [pathname, queryString] = cleanEndpoint.split('?');
  const method = (options.method || 'GET').toUpperCase();
  const searchParams = new URLSearchParams(queryString || '');
  let body = options.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {}
  }
  body = body || {};

  const store = getStore();

  // 1. /profiles
  if (pathname === '/profiles' && method === 'GET') {
    return {
      data: store.profiles || [],
      total: (store.profiles || []).length,
      illustrative: true,
    };
  }

  if (pathname === '/profiles/me' && method === 'GET') {
    const profile = (store.profiles || []).find((p) => p.id === activeProfileId) || store.profiles[0];
    return { data: profile, illustrative: true };
  }

  const profileMatch = pathname.match(/^\/profiles\/([^/]+)$/);
  if (profileMatch && method === 'GET') {
    const id = profileMatch[1];
    const profile = (store.profiles || []).find((p) => p.id === id);
    if (!profile) throw new Error(`Profile ${id} not found`);
    return { data: profile, illustrative: true };
  }

  // 2. /waste
  if (pathname === '/waste/assess' && method === 'POST') {
    return assessFeedstock(body);
  }

  if (pathname === '/waste/match' && method === 'POST') {
    return findMatchingPlants(body);
  }

  if (pathname === '/waste' && method === 'GET') {
    return { data: store.wasteProfiles || [], illustrative: true };
  }

  if (pathname === '/waste' && method === 'POST') {
    const profileId = body.profileId || activeProfileId;
    const index = (store.wasteProfiles || []).findIndex((w) => w.profileId === profileId);
    const newWp = {
      profileId,
      wasteType: body.wasteType || 'not sure',
      quantityRange: body.quantityRange || 'not sure',
      frequency: body.frequency || 'not sure',
      intendedUse: body.intendedUse || 'not sure',
      siteConstraints: body.siteConstraints || 'not sure',
      updatedAt: new Date().toISOString(),
    };
    if (index >= 0) {
      store.wasteProfiles[index] = newWp;
    } else {
      store.wasteProfiles.push(newWp);
    }
    saveStore(store);
    return { message: 'Waste profile saved', data: newWp, illustrative: true };
  }

  const wasteMatch = pathname.match(/^\/waste\/([^/]+)$/);
  if (wasteMatch && method === 'GET') {
    const profileId = wasteMatch[1];
    const wp = (store.wasteProfiles || []).find((w) => w.profileId === profileId);
    if (!wp) {
      const err = new Error('No saved waste profile found');
      err.status = 404;
      throw err;
    }
    return { data: wp, illustrative: true };
  }

  // 3. /plants
  if (pathname === '/plants/compare' && (method === 'POST' || method === 'GET')) {
    const ids = body.plantIds || (searchParams.get('ids') ? searchParams.get('ids').split(',') : []);
    return comparePlants(ids);
  }

  if (pathname === '/plants' && method === 'GET') {
    const scale = searchParams.get('scale');
    const area = searchParams.get('area');
    const feedstock = searchParams.get('feedstock');

    let plants = [...(store.plants || [])];
    const allEvidence = store.evidence || [];

    if (scale) {
      plants = plants.filter((p) => p.scale.toLowerCase() === scale.toLowerCase());
    }
    if (area) {
      const areaLower = area.toLowerCase();
      plants = plants.filter((p) =>
        p.serviceArea.some((sa) => sa.toLowerCase().includes(areaLower) || areaLower.includes(sa.toLowerCase()))
      );
    }
    if (feedstock) {
      const feedLower = feedstock.toLowerCase();
      plants = plants.filter((p) =>
        p.supportedFeedstock.some((sf) => sf.toLowerCase().includes(feedLower) || feedLower.includes(sf.toLowerCase()))
      );
    }

    const enriched = plants.map((plant) => {
      const plantEv = allEvidence.filter((e) => e.plantId === plant.id);
      const providedCount = plantEv.filter((e) => e.status === 'provided').length;
      const pendingCount = plantEv.filter((e) => e.status === 'pending').length;
      const missingCount = plantEv.filter((e) => e.status === 'missing').length;
      const completeness = calculateCompleteness(plant, plantEv);

      return {
        ...plant,
        completeness,
        evidenceSummary: {
          total: plantEv.length,
          provided: providedCount,
          pending: pendingCount,
          missing: missingCount,
          hasMissingEvidence: missingCount > 0,
        },
      };
    });

    return { data: enriched, total: enriched.length, illustrative: true };
  }

  const plantMatch = pathname.match(/^\/plants\/([^/]+)$/);
  if (plantMatch && method === 'GET') {
    const id = plantMatch[1];
    const plant = (store.plants || []).find((p) => p.id === id);
    if (!plant) {
      const err = new Error('Plant provider not found');
      err.status = 404;
      throw err;
    }

    const plantEvidence = (store.evidence || []).filter((e) => e.plantId === plant.id);
    const providedCount = plantEvidence.filter((e) => e.status === 'provided').length;
    const pendingCount = plantEvidence.filter((e) => e.status === 'pending').length;
    const missingCount = plantEvidence.filter((e) => e.status === 'missing').length;
    const completeness = calculateCompleteness(plant, plantEvidence);

    const claims = {
      marketingServices: plant.services || [],
      statedOmOffering: plant.omOffering,
      isOmVerified: !plant.omOffering.toLowerCase().includes('not provided') && providedCount >= 2,
      statedWarranty: plant.warranty,
      isWarrantyVerified:
        !plant.warranty.toLowerCase().includes('not provided') &&
        !plant.warranty.toLowerCase().includes('unverified'),
    };

    const responsibilities = {
      customerDuties:
        plant.scale === 'small'
          ? [
              'Daily feedstock separation and sorting (zero non-organics)',
              'Manual feedstock feeding and water ratio balancing',
              'Weekly digestate effluent removal or garden diversion',
              'Daily monitoring of gas pressure gauge and odor seal',
            ]
          : [
              'Providing vehicle access to feedstock loading hopper',
              'Ensuring minimum daily feedstock tonnage delivery',
              'Maintaining safe perimeter clearances and gas safety zones',
            ],
      providerDuties:
        plant.scale === 'small'
          ? [
              'Equipment delivery and initial connection assembly',
              'Annual mechanical checkup (if contracted)',
              'Remote replacement parts dispatch',
            ]
          : [
              'Turnkey civil engineering and ground containment works',
              'Full SCADA remote telemetry and 24/7 biological monitoring',
              'Quarterly anaerobic digestate testing and bi-annual maintenance overhaul',
              'Emergency callout SLA for gas flare or pressure anomalies',
            ],
    };

    const supplyContinuity = {
      storageBufferHours:
        plant.scale === 'small' ? '8–12 hours buffer in flexible gas bag' : '24–48 hours pressurized buffer skid',
      winterPerformance:
        plant.scale === 'small'
          ? 'Gas production drops 30%–50% if ambient temperatures drop below 8°C without auxiliary tank heating blanket.'
          : 'Continuous mesophilic heating jacket maintains constant 37°C digestion with negligible seasonal yield variation.',
      backupRecommendation:
        'Secondary fossil gas or electric heating backup recommended for critical thermal processes.',
    };

    return {
      data: {
        ...plant,
        completeness,
        claims,
        evidence: plantEvidence,
        responsibilities,
        supplyContinuity,
        evidenceSummary: {
          total: plantEvidence.length,
          provided: providedCount,
          pending: pendingCount,
          missing: missingCount,
        },
      },
      illustrative: true,
    };
  }

  if (plantMatch && method === 'PUT') {
    const id = plantMatch[1];
    const index = (store.plants || []).findIndex((p) => p.id === id);
    if (index === -1) {
      const err = new Error('Plant provider not found');
      err.status = 404;
      throw err;
    }

    store.plants[index] = {
      ...store.plants[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    saveStore(store);

    const plantEvidence = (store.evidence || []).filter((e) => e.plantId === id);
    const completeness = calculateCompleteness(store.plants[index], plantEvidence);

    return {
      message: 'Plant profile updated',
      data: { ...store.plants[index], completeness },
      illustrative: true,
    };
  }

  // 4. /evidence
  if (pathname === '/evidence' && method === 'GET') {
    const plantId = searchParams.get('plantId');
    const list = plantId
      ? (store.evidence || []).filter((e) => e.plantId === plantId)
      : store.evidence || [];
    return { data: list, total: list.length, illustrative: true };
  }

  if (pathname === '/evidence' && method === 'POST') {
    const newEvidence = {
      id: `ev-${Date.now()}`,
      plantId: body.plantId,
      type: body.type,
      title: body.title,
      status: body.status || 'pending',
      date: body.date || new Date().toISOString().split('T')[0],
      source: body.source || 'Simulated upload',
      details: body.details || '',
      createdAt: new Date().toISOString(),
    };
    if (!store.evidence) store.evidence = [];
    store.evidence.push(newEvidence);
    saveStore(store);
    return { message: 'Simulated evidence record added', data: newEvidence, illustrative: true };
  }

  const evMatch = pathname.match(/^\/evidence\/([^/]+)$/);
  if (evMatch && method === 'DELETE') {
    const id = evMatch[1];
    const idx = (store.evidence || []).findIndex((e) => e.id === id);
    if (idx === -1) {
      const err = new Error('Evidence record not found');
      err.status = 404;
      throw err;
    }
    store.evidence.splice(idx, 1);
    saveStore(store);
    return { message: 'Evidence record deleted', id, illustrative: true };
  }

  // 5. /assumptions
  if (pathname === '/assumptions' && method === 'GET') {
    return {
      data: store.assumptions || [],
      total: (store.assumptions || []).length,
      illustrative: true,
    };
  }

  const assumptionMatch = pathname.match(/^\/assumptions\/([^/]+)$/);
  if (assumptionMatch && method === 'GET') {
    const wasteType = decodeURIComponent(assumptionMatch[1]).toLowerCase();
    const found = (store.assumptions || []).find((a) => a.wasteType.toLowerCase() === wasteType);
    if (!found) {
      const err = new Error('No baseline assumption found');
      err.status = 404;
      throw err;
    }
    return { data: found, illustrative: true };
  }

  // 6. /enquiries
  if (pathname === '/enquiries' && method === 'GET') {
    const toPlantId = searchParams.get('toPlantId');
    const fromProfile = searchParams.get('fromProfile');

    let list = store.enquiries || [];
    if (toPlantId) {
      list = list.filter((e) => e.toPlantIds && e.toPlantIds.includes(toPlantId));
    }
    if (fromProfile) {
      list = list.filter((e) => e.fromProfile === fromProfile);
    }
    return { data: list, total: list.length, illustrative: true };
  }

  if (pathname === '/enquiries' && method === 'POST') {
    const fromProfile = body.fromProfile || activeProfileId || 'waste-restaurant-1';
    const sender = (store.profiles || []).find((p) => p.id === fromProfile);
    const fromName = sender ? sender.name : body.fromName || 'Participant';

    const newEnquiry = {
      id: `enq-${Date.now()}`,
      fromProfile,
      fromName,
      toPlantIds: Array.isArray(body.toPlantIds) ? body.toPlantIds : [body.toPlantIds],
      summary: body.summary || {},
      questions: body.questions || '',
      contactPreference: body.contactPreference || 'Email',
      status: 'pending_review',
      replies: [],
      createdAt: new Date().toISOString(),
    };

    if (!store.enquiries) store.enquiries = [];
    store.enquiries.unshift(newEnquiry);
    saveStore(store);

    return {
      message: 'Simulated enquiry created and forwarded to plant inbox',
      data: newEnquiry,
      illustrative: true,
    };
  }

  const replyMatch = pathname.match(/^\/enquiries\/([^/]+)\/reply$/);
  if (replyMatch && method === 'POST') {
    const id = replyMatch[1];
    const enquiry = (store.enquiries || []).find((e) => e.id === id);
    if (!enquiry) {
      const err = new Error('Enquiry not found');
      err.status = 404;
      throw err;
    }
    if (!enquiry.replies) enquiry.replies = [];
    enquiry.replies.push({
      id: `reply-${Date.now()}`,
      fromPlantId: body.fromPlantId || activeProfileId,
      text: body.replyText,
      createdAt: new Date().toISOString(),
    });
    enquiry.status = 'answered';
    enquiry.updatedAt = new Date().toISOString();
    saveStore(store);
    return { message: 'Simulated reply posted', data: enquiry, illustrative: true };
  }

  const statusMatch = pathname.match(/^\/enquiries\/([^/]+)\/status$/);
  if (statusMatch && (method === 'PATCH' || method === 'PUT')) {
    const id = statusMatch[1];
    const enquiry = (store.enquiries || []).find((e) => e.id === id);
    if (!enquiry) {
      const err = new Error('Enquiry not found');
      err.status = 404;
      throw err;
    }
    enquiry.status = body.status;
    enquiry.updatedAt = new Date().toISOString();
    saveStore(store);
    return { message: `Enquiry status updated to ${body.status}`, data: enquiry, illustrative: true };
  }

  // Fallback 404
  const notFoundErr = new Error(`Mock endpoint not found: ${method} ${pathname}`);
  notFoundErr.status = 404;
  throw notFoundErr;
}

export default {
  handleMockRequest,
};
