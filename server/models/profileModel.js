import { getStore, saveStore } from './store.js';

export function getAllProfiles() {
  const store = getStore();
  return store.profiles || [];
}

export function getProfileById(id) {
  const profiles = getAllProfiles();
  return profiles.find((p) => p.id === id) || null;
}

export function updateProfile(id, updates) {
  const store = getStore();
  const index = store.profiles.findIndex((p) => p.id === id);
  if (index === -1) return null;

  store.profiles[index] = {
    ...store.profiles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveStore();
  return store.profiles[index];
}

export default {
  getAllProfiles,
  getProfileById,
  updateProfile,
};
