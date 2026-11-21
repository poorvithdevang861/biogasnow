import { getStore, saveStore } from './store.js';

export function getAllWasteProfiles() {
  const store = getStore();
  return store.wasteProfiles || [];
}

export function getWasteProfileByProfileId(profileId) {
  const list = getAllWasteProfiles();
  return list.find((wp) => wp.profileId === profileId) || null;
}

export function upsertWasteProfile(data) {
  const store = getStore();
  const index = store.wasteProfiles.findIndex((wp) => wp.profileId === data.profileId);

  const entry = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    store.wasteProfiles[index] = { ...store.wasteProfiles[index], ...entry };
  } else {
    store.wasteProfiles.push(entry);
  }

  saveStore();
  return entry;
}

export default {
  getAllWasteProfiles,
  getWasteProfileByProfileId,
  upsertWasteProfile,
};
