import plantModel from '../models/plantModel.js';
import evidenceModel from '../models/evidenceModel.js';

/**
 * Plant comparison service
 * Evaluates 2-3 plant providers side-by-side with uniform fields and explicit flags for missing data.
 */
export function comparePlants(plantIds = []) {
  if (!Array.isArray(plantIds) || plantIds.length < 2) {
    throw new Error('Comparison requires at least 2 plant provider IDs');
  }

  const allEvidence = evidenceModel.getAllEvidence();

  const comparedPlants = plantIds.slice(0, 3).map((id) => {
    const plant = plantModel.getPlantById(id);
    if (!plant) {
      return {
        id,
        found: false,
        error: `Plant provider ${id} not found`,
      };
    }

    const plantEv = allEvidence.filter((e) => e.plantId === id);

    // Specific evidence categories
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

    // Check for unverified warranty or O&M
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
      // Claims
      statedOmOffering: plant.omOffering,
      isOmMissing,
      statedWarranty: plant.warranty,
      isWarrantyMissing,
      // Evidence
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
      // Supply continuity notes
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

export default {
  comparePlants,
};
