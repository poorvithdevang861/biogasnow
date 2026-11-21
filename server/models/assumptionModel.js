import { getStore } from './store.js';

export function getAllAssumptions() {
  const store = getStore();
  return store.assumptions || [];
}

export function getAssumptionByWasteType(wasteType) {
  if (!wasteType) return null;
  const list = getAllAssumptions();
  const normalized = wasteType.toLowerCase().trim();

  return (
    list.find(
      (a) =>
        a.wasteType.toLowerCase().trim() === normalized ||
        normalized.includes(a.wasteType.toLowerCase().trim()) ||
        a.wasteType.toLowerCase().trim().includes(normalized)
    ) || null
  );
}

export default {
  getAllAssumptions,
  getAssumptionByWasteType,
};
