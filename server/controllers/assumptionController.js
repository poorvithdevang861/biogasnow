import assumptionModel from '../models/assumptionModel.js';

export function getAssumptions(req, res) {
  const assumptions = assumptionModel.getAllAssumptions();
  res.json({
    data: assumptions,
    total: assumptions.length,
    illustrative: true,
  });
}

export function getAssumptionByWasteType(req, res) {
  const wasteType = req.params.wasteType || req.query.wasteType;
  const assumption = assumptionModel.getAssumptionByWasteType(wasteType);

  if (!assumption) {
    return res.status(404).json({
      error: 'No documented baseline assumption found for this waste type',
      wasteType,
      status: 'assessment_required',
    });
  }

  res.json({
    data: assumption,
    illustrative: true,
  });
}

export default {
  getAssumptions,
  getAssumptionByWasteType,
};
