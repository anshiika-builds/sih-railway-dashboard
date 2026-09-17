// RailWise REST API Client Service

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '';

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
  baseUrl: API_BASE_URL,
  getHealth: () => fetchJson('/api/health'),
  getMetrics: () => fetchJson('/api/metrics'),
  
  getCorridors: () => fetchJson('/api/corridors'),
  
  getMaintenance: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/maintenance${query ? `?${query}` : ''}`);
  },
  
  getMaintenanceTask: (taskId) => fetchJson(`/api/maintenance/${encodeURIComponent(taskId)}`),
  
  getRecommendations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/recommendations${query ? `?${query}` : ''}`);
  },

  getRecommendation: (taskId) => fetchJson(`/api/recommendations/${encodeURIComponent(taskId)}`),

  getOptimizedBlocks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/optimized-blocks${query ? `?${query}` : ''}`);
  },
  
  getConflicts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/conflicts${query ? `?${query}` : ''}`);
  },
  
  getBaselineComparison: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/baseline-comparison${query ? `?${query}` : ''}`);
  },
  
  getAssets: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/assets${query ? `?${query}` : ''}`);
  },

  getBlockRequests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/block-requests${query ? `?${query}` : ''}`);
  },

  getCoaAvailability: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/coa-availability${query ? `?${query}` : ''}`);
  },

  getGoodsForecast: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/goods-forecast${query ? `?${query}` : ''}`);
  },

  getTrainSchedule: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/train-schedule${query ? `?${query}` : ''}`);
  },

  getMovementWindows: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/movement-windows${query ? `?${query}` : ''}`);
  },

  getHistoricalPlans: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/historical-plans${query ? `?${query}` : ''}`);
  },

  getRiskPredictions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/risk${query ? `?${query}` : ''}`);
  },
  
  getCandidates: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/api/candidates${query ? `?${query}` : ''}`);
  },
  
  predictPriority: (payload) => fetchJson('/api/predict-priority', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
};

export default api;

