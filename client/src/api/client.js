/**
 * API client wrapper for Biogas Trust & Adoption Platform
 * Sends X-Demo-Profile header on all requests from localStorage
 * Automatically falls back to client-side mock store when running on GitHub Pages
 * or when the backend server is unreachable.
 */
import { handleMockRequest } from './mockEngine';

const API_BASE = '/api';

export function getActiveProfileId() {
  try {
    return localStorage.getItem('biogas_demo_profile_id') || 'waste-restaurant-1';
  } catch {
    return 'waste-restaurant-1';
  }
}

export function setActiveProfileId(profileId) {
  try {
    localStorage.setItem('biogas_demo_profile_id', profileId);
  } catch (err) {
    console.error('Failed to set active profile in localStorage', err);
  }
}

/**
 * Determine if client should immediately use client-side mock
 * e.g., on GitHub Pages (*.github.io) or static builds where no backend exists
 */
function isStaticEnvironment() {
  if (typeof window === 'undefined') return false;
  const { hostname } = window.location;
  if (hostname.includes('github.io')) return true;
  // If explicitly building with custom base path on non-localhost
  if (import.meta.env.BASE_URL !== '/' && hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return true;
  }
  return false;
}

export async function apiRequest(endpoint, options = {}) {
  const activeProfileId = getActiveProfileId();

  // If deployed statically on GitHub Pages, use mock engine directly without network latency
  if (isStaticEnvironment()) {
    try {
      return await handleMockRequest(endpoint, options, activeProfileId);
    } catch (err) {
      console.warn('[Mock Engine] Request error:', err);
      throw err;
    }
  }

  // Otherwise, attempt real backend request
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    'X-Demo-Profile': activeProfileId,
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    // If backend returns 404 or server error (e.g., backend down or static host returned 404 for /api),
    // fall back to mock handler
    if (!response.ok) {
      if (response.status === 404 || response.status >= 500) {
        console.warn(`[API] Remote call to ${url} returned ${response.status}. Falling back to mock data.`);
        return await handleMockRequest(endpoint, options, activeProfileId);
      }

      let errorData = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText || 'Unknown network error' };
      }
      const error = new Error(errorData.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (networkErr) {
    // If fetch failed completely (e.g. ECONNREFUSED or no backend), fall back to mock engine
    console.warn(`[API] Fetch failed for ${endpoint}. Falling back to local mock store.`, networkErr.message);
    return await handleMockRequest(endpoint, options, activeProfileId);
  }
}

export const api = {
  get: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
