
// src/lib/api.js
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

async function request(path, { method='GET', headers={}, body, params } = {}) {
  const url = new URL(`/api${path}`, API_BASE);
  if (params && typeof params === 'object') {
    for (const [k,v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString(), {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include'
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({error:'Request failed'}));
    throw new Error(err?.error || res.statusText);
  }
  return res.json();
}

export const api = {
  auth: {
    login: (username, password) => request('/auth/login', { method:'POST', body:{ username, password } }),
    me: () => request('/auth/me'),
    logout: () => request('/auth/logout', { method:'POST' }),
  },
  equipments: {
    list: (filters) => request('/equipments', { params: filters }),
    get: (id) => request(`/equipments/${id}`),
    create: (data) => request('/equipments', { method:'POST', body:data }),
    update: (id, data) => request(`/equipments/${id}`, { method:'PUT', body:data }),
    remove: (id) => request(`/equipments/${id}`, { method:'DELETE' }),
    checkout: (data) => request('/checkouts', { method:'POST', body:data }),
    return: (checkoutId, condition_notes) => request(`/checkouts/${checkoutId}/return`, { method:'POST', body:{ condition_notes } }),
    overdues: () => request('/checkouts/overdues'),
  },
  maint: {
    list: () => request('/maintenances'),
    create: (data) => request('/maintenances', { method:'POST', body:data }),
    update: (id, data) => request(`/maintenances/${id}`, { method:'PUT', body:data }),
  },
  reports: {
    utilization: () => request('/reports/utilization'),
    overdues: () => request('/reports/overdues'),
    maintenanceCosts: () => request('/reports/maintenance-costs'),
  },
  lookups: () => request('/lookups')
};
