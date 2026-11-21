import { getStore, saveStore } from './store.js';

export function getAllPlants() {
  const store = getStore();
  return store.plants || [];
}

export function getPlantById(id) {
  const list = getAllPlants();
  return list.find((p) => p.id === id) || null;
}

export function updatePlant(id, updates) {
  const store = getStore();
  const index = store.plants.findIndex((p) => p.id === id);
  if (index === -1) return null;

  store.plants[index] = {
    ...store.plants[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveStore();
  return store.plants[index];
}

export default {
  getAllPlants,
  getPlantById,
  updatePlant,
};
