// src/lib/api.js
import { getApiBaseUrl, getCurrentMode, API_MODES, forceOfflineMode } from './apiMode';
import { addToQueue, OPERATION_TYPES } from './offlineQueue';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

class ApiClient {
  constructor() {
    this.baseUrl = getApiBaseUrl();
  }

  updateBaseUrl() {
    this.baseUrl = getApiBaseUrl();
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: { ...DEFAULT_HEADERS, ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok && getCurrentMode() === API_MODES.ONLINE) {
        if (response.status === 401 || response.status === 403) {
          forceOfflineMode('Licence invalide ou expirée');
          throw new Error('Accès refusé - basculement vers le mode offline');
        } else if (response.status >= 500) {
          forceOfflineMode('Serveur indisponible');
          throw new Error('Serveur indisponible - basculement vers le mode offline');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'TypeError' && getCurrentMode() === API_MODES.ONLINE) {
        forceOfflineMode('Erreur de connexion réseau');
      }
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    const { queueable = true, operationType } = options;

    try {
      return await this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        ...options,
      });
    } catch (error) {
      if (!navigator.onLine && queueable && operationType) {
        await addToQueue(operationType, data, `${this.baseUrl}${endpoint}`);
        return {
          success: true,
          queued: true,
          message: 'Opération ajoutée à la queue offline',
          data: { id: `temp_${Date.now()}`, ...data },
        };
      }
      throw error;
    }
  }

  async put(endpoint, data, options = {}) {
    const { queueable = true, operationType } = options;

    try {
      return await this.request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
        ...options,
      });
    } catch (error) {
      if (!navigator.onLine && queueable && operationType) {
        await addToQueue(operationType, data, `${this.baseUrl}${endpoint}`);
        return {
          success: true,
          queued: true,
          message: 'Opération ajoutée à la queue offline',
          data,
        };
      }
      throw error;
    }
  }

  async delete(endpoint, options = {}) {
    const { queueable = true, operationType, data } = options;

    try {
      return await this.request(endpoint, {
        method: 'DELETE',
        ...options,
      });
    } catch (error) {
      if (!navigator.onLine && queueable && operationType) {
        await addToQueue(operationType, data || {}, `${this.baseUrl}${endpoint}`);
        return {
          success: true,
          queued: true,
          message: 'Opération ajoutée à la queue offline',
        };
      }
      throw error;
    }
  }
}

const apiClient = new ApiClient();

export const api = {
  equipment: {
    getAll: () => apiClient.get('/equipment'),
    getById: (id) => apiClient.get(`/equipment/${id}`),
    create: (data) => apiClient.post('/equipment', data, {
      operationType: OPERATION_TYPES.CREATE_EQUIPMENT,
    }),
    update: (id, data) => apiClient.put(`/equipment/${id}`, data, {
      operationType: OPERATION_TYPES.UPDATE_EQUIPMENT,
    }),
    delete: (id) => apiClient.delete(`/equipment/${id}`, {
      operationType: OPERATION_TYPES.DELETE_EQUIPMENT,
      data: { id },
    }),
  },

  checkout: {
    create: (data) => apiClient.post('/checkout', data, {
      operationType: OPERATION_TYPES.CHECKOUT,
    }),
    return: (checkoutId, data) => apiClient.post(`/checkout/${checkoutId}/return`, data, {
      operationType: OPERATION_TYPES.RETURN,
    }),
    getHistory: (params = {}) => apiClient.get('/checkout/history', params),
    getActive: () => apiClient.get('/checkout/active'),
  },

  maintenance: {
    getAll: (params = {}) => apiClient.get('/maintenance', params),
    getById: (id) => apiClient.get(`/maintenance/${id}`),
    create: (data) => apiClient.post('/maintenance', data, {
      operationType: OPERATION_TYPES.CREATE_MAINTENANCE,
    }),
    update: (id, data) => apiClient.put(`/maintenance/${id}`, data, {
      operationType: OPERATION_TYPES.UPDATE_MAINTENANCE,
    }),
    complete: (id, data) => apiClient.post(`/maintenance/${id}/complete`, data, {
      operationType: OPERATION_TYPES.UPDATE_MAINTENANCE,
    }),
  },

  reports: {
    inventory: (params = {}) => apiClient.get('/reports/inventory', params),
    usage: (params = {}) => apiClient.get('/reports/usage', params),
    maintenance: (params = {}) => apiClient.get('/reports/maintenance', params),
    dashboard: () => apiClient.get('/reports/dashboard'),
  },

  health: () => apiClient.get('/health'),

  license: {
    validate: (key) => apiClient.post('/license/validate', { key }, { queueable: false }),
    info: () => apiClient.get('/license/info', {}, { queueable: false }),
  },
};

export const updateApiMode = () => {
  apiClient.updateBaseUrl();
};

if (typeof window !== 'undefined') {
  window.addEventListener('apiModeChanged', updateApiMode);
}

export default api;
