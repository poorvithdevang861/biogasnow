import plantModel from '../models/plantModel.js';
import evidenceModel from '../models/evidenceModel.js';

/**
 * Plant matching service
 * Matches plant providers based on feedstock compatibility, service geography, and capacity sizing.
 */
export function findMatchingPlants(criteria = {}) {
  const { wasteType, location = '', quantityKg, scalePreference } = criteria;
  const allPlants = plantModel.getAllPlants();
  const allEvidence = evidenceModel.getAllEvidence();

  const results = allPlants.map((plant) => {
    const plantEv = allEvidence.filter((e) => e.plantId === plant.id);
    const providedCount = plantEv.filter((e) => e.status === 'provided').length;
    const pendingCount = plantEv.filter((e) => e.status === 'pending').length;
    const missingCount = plantEv.filter((e) => e.status === 'missing').length;

    // Check feedstock compatibility
    let feedstockMatch = false;
    if (!wasteType || wasteType === 'not sure') {
      feedstockMatch = true; // Can't filter strictly without waste type
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

    // Check area compatibility
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

    // Capacity compatibility check (if quantity specified)
    let capacityMatch = true;
    if (quantityKg) {
      const q = Number(quantityKg);
      capacityMatch = q >= plant.capacityMin * 0.7 && q <= plant.capacityMax * 1.5;
    }

    // Calculate match score
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

  // Sort by match score descending, then by provided evidence count
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

export default {
  findMatchingPlants,
};
