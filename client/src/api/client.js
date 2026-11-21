/**
 * API client wrapper for Biogas Trust & Adoption Platform
 * Sends X-Demo-Profile header on all requests from localStorage
 */

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

export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    'X-Demo-Profile': getActiveProfileId(),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
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

  // Handle empty responses (204)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  get: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'PUT', body }),
  delete: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
