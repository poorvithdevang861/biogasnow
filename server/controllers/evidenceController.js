import evidenceModel from '../models/evidenceModel.js';

export function getEvidence(req, res) {
  const { plantId } = req.query;
  const list = plantId
    ? evidenceModel.getEvidenceByPlantId(plantId)
    : evidenceModel.getAllEvidence();

  res.json({
    data: list,
    total: list.length,
    illustrative: true,
  });
}

export function addEvidence(req, res) {
  const { plantId, type, title, status, date, source, details } = req.body;

  if (!plantId || !title || !type) {
    return res.status(400).json({
      error: 'plantId, type, and title are required for evidence records',
    });
  }

  const added = evidenceModel.addEvidence({
    plantId,
    type,
    title,
    status: status || 'pending',
    date: date || new Date().toISOString().split('T')[0],
    source: source || 'Self-submitted document',
    details: details || '',
  });

  res.status(201).json({
    message: 'Simulated evidence record added',
    data: added,
    illustrative: true,
  });
}

export function deleteEvidence(req, res) {
  const { id } = req.params;
  const success = evidenceModel.deleteEvidence(id);
  if (!success) {
    return res.status(404).json({ error: 'Evidence record not found' });
  }

  res.json({
    message: 'Evidence record deleted',
    id,
    illustrative: true,
  });
}

export default {
  getEvidence,
  addEvidence,
  deleteEvidence,
};
