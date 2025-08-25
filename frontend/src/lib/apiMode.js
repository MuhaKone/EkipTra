// src/lib/apiMode.js

export const API_MODES = {
  OFFLINE: "offline",
  ONLINE: "online",
};

// Retourne le mode actuel (stocké dans localStorage)
export function getCurrentMode() {
  return localStorage.getItem("apiMode") || API_MODES.OFFLINE;
}

// Change le mode courant
export function setApiMode(mode) {
  if (Object.values(API_MODES).includes(mode)) {
    localStorage.setItem("apiMode", mode);
    const event = new Event("apiModeChanged");
    window.dispatchEvent(event);
  }
}

// Force le mode offline (si problème licence/serveur)
export function forceOfflineMode(reason) {
  console.warn("⚠️ Basculement forcé en OFFLINE :", reason);
  setApiMode(API_MODES.OFFLINE);
}

// 🔹 Sélection automatique entre API locale et cloud
export function getApiBaseUrl() {
  const mode = getCurrentMode();

  if (mode === API_MODES.ONLINE) {
    return import.meta.env.VITE_API_CLOUD || "https://your-cloud-api.com/api";
  }

  return import.meta.env.VITE_API_LOCAL || "http://localhost:4000/api";
}
