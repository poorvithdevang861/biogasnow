import { getStore, saveStore } from './store.js';

export function getAllEvidence() {
  const store = getStore();
  return store.evidence || [];
}

export function getEvidenceByPlantId(plantId) {
  const list = getAllEvidence();
  return list.filter((e) => e.plantId === plantId);
}

export function addEvidence(evidenceData) {
  const store = getStore();
  const newEvidence = {
    id: `ev-${Date.now()}`,
    plantId: evidenceData.plantId,
    type: evidenceData.type,
    title: evidenceData.title,
    status: evidenceData.status || 'pending',
    date: evidenceData.date || new Date().toISOString().split('T')[0],
    source: evidenceData.source || 'Simulated upload',
    details: evidenceData.details || '',
    createdAt: new Date().toISOString(),
  };

  store.evidence.push(newEvidence);
  saveStore();
  return newEvidence;
}

export function updateEvidence(id, updates) {
  const store = getStore();
  const index = store.evidence.findIndex((e) => e.id === id);
  if (index === -1) return null;

  store.evidence[index] = {
    ...store.evidence[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveStore();
  return store.evidence[index];
}

export function deleteEvidence(id) {
  const store = getStore();
  const index = store.evidence.findIndex((e) => e.id === id);
  if (index === -1) return false;

  store.evidence.splice(index, 1);
  saveStore();
  return true;
}

export default {
  getAllEvidence,
  getEvidenceByPlantId,
  addEvidence,
  updateEvidence,
  deleteEvidence,
};
