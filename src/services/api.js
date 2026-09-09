// RailWise REST API Client Service

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[RailWise API Service] Failed request to ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  getHealth: () => fetchJson('/api/health'),
  getMetrics: () => fetchJson('/api/metrics'),
  
  getMaintenance: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/maintenance${query ? `?${query}` : ''}`);
  },
  
  getMaintenanceTask: (taskId) => fetchJson(`/api/maintenance/${encodeURIComponent(taskId)}`),
  
  getRiskPredictions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/risk${query ? `?${query}` : ''}`);
  },
  
  getCandidates: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/candidates${query ? `?${query}` : ''}`);
  },
  
  getConflicts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/conflicts${query ? `?${query}` : ''}`);
  },
  
  getOptimizedBlocks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/optimized-blocks${query ? `?${query}` : ''}`);
  },
  
  getRecommendation: (taskId) => fetchJson(`/api/recommendations/${encodeURIComponent(taskId)}`),
  
  getBaselineComparison: () => fetchJson('/api/baseline-comparison'),
  
  getTrainSchedule: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/train-schedule${query ? `?${query}` : ''}`);
  },
  
  getCorridors: () => fetchJson('/api/corridors'),
  
  predictPriority: (payload) => fetchJson('/api/predict-priority', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
};

export default api;
