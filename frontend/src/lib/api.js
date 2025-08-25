import { getApiBaseUrl, getCurrentMode, API_MODES, forceOfflineMode } from './apiMode';
import { addToQueue, OPERATION_TYPES } from './offlineQueue';

// Configuration par défaut
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Wrapper pour les requêtes API avec gestion offline/online
class ApiClient {
  constructor() {
    this.baseUrl = getApiBaseUrl();
  }

  // Mettre à jour l'URL de base si le mode change
  updateBaseUrl() {
    this.baseUrl = getApiBaseUrl();
  }

  // Requête générique avec gestion d'erreurs
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: { ...DEFAULT_HEADERS, ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Si l'API cloud n'est pas accessible, basculer en mode offline
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
      // Si erreur réseau et qu'on est en mode online, essayer de basculer vers offline
      if (error.name === 'TypeError' && getCurrentMode() === API_MODES.ONLINE) {
        forceOfflineMode('Erreur de connexion réseau');
      }
      throw error;
    }
  }

  // GET - toujours synchrone
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  // POST avec gestion offline queue
  async post(endpoint, data, options = {}) {
    const { queueable = true, operationType } = options;

    try {
      return await this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        ...options,
      });
    } catch (error) {
      // Si offline et opération peut être mise en queue
      if (!navigator.onLine && queueable && operationType) {
        await addToQueue(operationType, data, `${this.baseUrl}${endpoint}`);
        
        // Retourner une réponse simulée pour l'UI
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

  // PUT avec gestion offline queue
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

  // DELETE avec gestion offline queue
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

// Instance singleton
const apiClient = new ApiClient();

// API Methods pour EkipTra
export const api = {
  // Équipements
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

  // Checkout/Return
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

  // Maintenance
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

  // Rapports
  reports: {
    inventory: (params = {}) => apiClient.get('/reports/inventory', params),
    usage: (params = {}) => apiClient.get('/reports/usage', params),
    maintenance: (params = {}) => apiClient.get('/reports/maintenance', params),
    dashboard: () => apiClient.get('/reports/dashboard'),
  },

  // Santé de l'API
  health: () => apiClient.get('/health'),

  // Licence (mode online uniquement)
  license: {
    validate: (key) => apiClient.post('/license/validate', { key }, { queueable: false }),
    info: () => apiClient.get('/license/info', {}, { queueable: false }),
  },
};

// Hook pour réagir aux changements de mode API
export const updateApiMode = () => {
  apiClient.updateBaseUrl();
};

// Écouter les changements de mode
if (typeof window !== 'undefined') {
  window.addEventListener('apiModeChanged', updateApiMode);
}

export default api;