import assumptionModel from '../models/assumptionModel.js';

/**
 * Feedstock assessment service
 * Calculates indicative biogas ranges based on documented research assumptions.
 * Returns "Assessment required" if inputs are uncertain or undocumented.
 */
export function assessFeedstock(input = {}) {
  const {
    wasteType,
    quantityKg,
    quantityMinKg,
    quantityMaxKg,
    frequency = 'daily',
    siteConstraints = '',
    location = '',
  } = input;

  // 1. Check for explicit "not sure" flags or missing critical metrics
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

  // 2. Fetch documented research assumptions for this waste type
  const assumption = assumptionModel.getAssumptionByWasteType(wasteType);

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

  // 3. Compute quantitative yield ranges
  let minDailyKg = 0;
  let maxDailyKg = 0;

  if (quantityKg) {
    const val = Number(quantityKg);
    minDailyKg = Math.round(val * 0.85); // Account for moisture and seasonal variance
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

  // If frequency is weekly, convert to daily equivalent for standard digestion sizing
  if (frequency.toLowerCase().includes('week')) {
    minDailyKg = Math.round((minDailyKg / 7) * 10) / 10;
    maxDailyKg = Math.round((maxDailyKg / 7) * 10) / 10;
  }

  // Yield rates in m³ per tonne: convert to m³ per kg (divide by 1000)
  const yieldRateMinPerKg = assumption.yieldMin / 1000;
  const yieldRateMaxPerKg = assumption.yieldMax / 1000;

  const minDailyBiogasM3 = Math.round(minDailyKg * yieldRateMinPerKg * 10) / 10;
  const maxDailyBiogasM3 = Math.round(maxDailyKg * yieldRateMaxPerKg * 10) / 10;

  const minAnnualBiogasM3 = Math.round(minDailyBiogasM3 * 365);
  const maxAnnualBiogasM3 = Math.round(maxDailyBiogasM3 * 365);

  // Energy equivalent: Average biogas is ~6.0 kWh/m³ thermal energy (approx 21.6 MJ/m³)
  const thermalMultiplierKWh = 6.0;
  const minThermalDailyKWh = Math.round(minDailyBiogasM3 * thermalMultiplierKWh * 10) / 10;
  const maxThermalDailyKWh = Math.round(maxDailyBiogasM3 * thermalMultiplierKWh * 10) / 10;

  // LPG equivalent: 1 kg LPG is approx 1.9 m³ biogas equivalent
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

export default {
  assessFeedstock,
};
