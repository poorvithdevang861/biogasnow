import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const SEED_DIR = path.resolve(DATA_DIR, 'seed');
const STORE_PATH = path.resolve(DATA_DIR, 'store.json');

let store = null;

function loadSeed(filename) {
  const filePath = path.join(SEED_DIR, filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[Store] Could not read seed file ${filename}:`, err.message);
    return [];
  }
}

export function initStore() {
  if (fs.existsSync(STORE_PATH)) {
    try {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      store = JSON.parse(raw);
      console.log('[Store] Loaded existing store from store.json');
      return store;
    } catch (err) {
      console.error('[Store] Failed to parse store.json, re-seeding:', err.message);
    }
  }

  // Populate from seeds
  store = {
    profiles: loadSeed('profiles.json'),
    wasteProfiles: loadSeed('wasteProfiles.json'),
    plants: loadSeed('plants.json'),
    evidence: loadSeed('evidence.json'),
    assumptions: loadSeed('assumptions.json'),
    enquiries: loadSeed('enquiries.json'),
    metadata: {
      initializedAt: new Date().toISOString(),
      version: '0.1.0',
      prototype: 'illustrative',
    },
  };

  saveStore();
  console.log('[Store] Initialized store.json from seed files');
  return store;
}

export function getStore() {
  if (!store) {
    return initStore();
  }
  return store;
}

export function saveStore() {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Store] Error writing to store.json:', err.message);
  }
}

export default {
  initStore,
  getStore,
  saveStore,
};
