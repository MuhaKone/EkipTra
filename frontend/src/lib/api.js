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
  auth: {
    login: (username, password) => apiClient.post('/auth/login', { username, password }, { queueable: false }),
    logout: () => apiClient.post('/auth/logout', {}, { queueable: false }),
    me: () => apiClient.get('/auth/me', {}, { queueable: false }),
  },

  equipment: {
    getAll: (params = {}) => apiClient.get('/equipments', params),
    getById: (id) => apiClient.get(`/equipments/${id}`),
    create: (data) => apiClient.post('/equipments', data, {
      operationType: OPERATION_TYPES.CREATE_EQUIPMENT,
    }),
    update: (id, data) => apiClient.put(`/equipments/${id}`, data, {
      operationType: OPERATION_TYPES.UPDATE_EQUIPMENT,
    }),
    delete: (id) => apiClient.delete(`/equipments/${id}`, {
      operationType: OPERATION_TYPES.DELETE_EQUIPMENT,
      data: { id },
    }),
  },

  checkout: {
    create: (data) => apiClient.post('/checkouts', data, {
      operationType: OPERATION_TYPES.CHECKOUT,
    }),
    return: (checkoutId, data) => apiClient.post(`/checkouts/${checkoutId}/return`, data, {
      operationType: OPERATION_TYPES.RETURN,
    }),
    getOverdues: () => apiClient.get('/checkouts/overdues'),
  },

  maintenance: {
    getAll: (params = {}) => apiClient.get('/maintenances', params),
    create: (data) => apiClient.post('/maintenances', data, {
      operationType: OPERATION_TYPES.CREATE_MAINTENANCE,
    }),
    update: (id, data) => apiClient.put(`/maintenances/${id}`, data, {
      operationType: OPERATION_TYPES.UPDATE_MAINTENANCE,
    }),
  },

  reports: {
    utilization: () => apiClient.get('/reports/utilization'),
    overdues: () => apiClient.get('/reports/overdues'),
    maintenanceCosts: () => apiClient.get('/reports/maintenance-costs'),
  },

  lookups: () => apiClient.get('/lookups'),

  health: () => apiClient.get('/health'),

  license: {
    validate: (key) => apiClient.get(`/license/validate?key=${key}`, {}, { queueable: false }),
  },
};

export const updateApiMode = () => {
  apiClient.updateBaseUrl();
};

if (typeof window !== 'undefined') {
  window.addEventListener('apiModeChanged', updateApiMode);
}

export default api;
