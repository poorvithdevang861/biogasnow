import plantModel from '../models/plantModel.js';
import evidenceModel from '../models/evidenceModel.js';
import { comparePlants } from '../services/compare.js';

function calculateCompleteness(plant, plantEvidence) {
  let score = 0;
  const missingItems = [];

  // 1. Basic details (20 pts)
  if (plant.supportedFeedstock && plant.supportedFeedstock.length > 0) score += 10;
  else missingItems.push('Supported feedstocks not specified');

  if (plant.serviceArea && plant.serviceArea.length > 0) score += 10;
  else missingItems.push('Service area boundaries not specified');

  // 2. Commercial terms (30 pts)
  const isOmProvided = plant.omOffering && !plant.omOffering.toLowerCase().includes('not provided') && !plant.omOffering.toLowerCase().includes('not verified');
  if (isOmProvided) score += 15;
  else missingItems.push('O&M servicing agreement not specified');

  const isWarrantyProvided = plant.warranty && !plant.warranty.toLowerCase().includes('not provided') && !plant.warranty.toLowerCase().includes('unverified');
  if (isWarrantyProvided) score += 15;
  else missingItems.push('Structural & mechanical warranty not specified');

  // 3. Evidence categories (50 pts)
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

export function getPlants(req, res) {
  const { scale, area, feedstock } = req.query;
  let plants = plantModel.getAllPlants();
  const allEvidence = evidenceModel.getAllEvidence();

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

  // Enrich with evidence breakdown & completeness
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

  res.json({
    data: enriched,
    total: enriched.length,
    illustrative: true,
  });
}

export function getPlantById(req, res) {
  const plant = plantModel.getPlantById(req.params.id);
  if (!plant) {
    return res.status(404).json({ error: 'Plant provider not found' });
  }

  const plantEvidence = evidenceModel.getEvidenceByPlantId(plant.id);
  const providedCount = plantEvidence.filter((e) => e.status === 'provided').length;
  const pendingCount = plantEvidence.filter((e) => e.status === 'pending').length;
  const missingCount = plantEvidence.filter((e) => e.status === 'missing').length;
  const completeness = calculateCompleteness(plant, plantEvidence);

  // Separate claims from evidence explicitly
  const claims = {
    marketingServices: plant.services || [],
    statedOmOffering: plant.omOffering,
    isOmVerified: !plant.omOffering.toLowerCase().includes('not provided') && providedCount >= 2,
    statedWarranty: plant.warranty,
    isWarrantyVerified: !plant.warranty.toLowerCase().includes('not provided') && !plant.warranty.toLowerCase().includes('unverified'),
  };

  // Operational responsibilities
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

  // Supply continuity information
  const supplyContinuity = {
    storageBufferHours: plant.scale === 'small' ? '8–12 hours buffer in flexible gas bag' : '24–48 hours pressurized buffer skid',
    winterPerformance:
      plant.scale === 'small'
        ? 'Gas production drops 30%–50% if ambient temperatures drop below 8°C without auxiliary tank heating blanket.'
        : 'Continuous mesophilic heating jacket maintains constant 37°C digestion with negligible seasonal yield variation.',
    backupRecommendation: 'Secondary fossil gas or electric heating backup recommended for critical thermal processes.',
  };

  res.json({
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
  });
}

export function updatePlantEndpoint(req, res) {
  const { id } = req.params;
  const updates = req.body;

  const updated = plantModel.updatePlant(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Plant provider not found' });
  }

  const plantEvidence = evidenceModel.getEvidenceByPlantId(id);
  const completeness = calculateCompleteness(updated, plantEvidence);

  res.json({
    message: 'Plant profile updated',
    data: {
      ...updated,
      completeness,
    },
    illustrative: true,
  });
}

export function comparePlantsEndpoint(req, res) {
  try {
    const rawIds = req.body?.plantIds || req.body?.ids || (req.query?.ids ? req.query.ids.split(',') : []);
    const plantIds = Array.isArray(rawIds) ? rawIds.map((id) => id.trim()).filter(Boolean) : [];
    if (!plantIds || plantIds.length < 2) {
      return res.status(400).json({ error: 'Please provide at least 2 plant IDs to compare' });
    }
    const result = comparePlants(plantIds);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export default {
  getPlants,
  getPlantById,
  updatePlantEndpoint,
  comparePlantsEndpoint,
};
