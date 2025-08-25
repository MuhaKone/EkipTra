// src/lib/apiMode.js

export const API_MODES = {
  OFFLINE: "offline",
  ONLINE: "online",
};

// Récupérer le mode courant
export function getCurrentMode() {
  return localStorage.getItem("apiMode") || API_MODES.OFFLINE;
}

// Forcer un mode précis
export function setApiMode(mode) {
  if (Object.values(API_MODES).includes(mode)) {
    localStorage.setItem("apiMode", mode);

    // Déclencher un event global (utile pour ton hook dans api.js)
    const event = new Event("apiModeChanged");
    window.dispatchEvent(event);
  }
}

// Forcer offline (si serveur down ou licence invalide)
export function forceOfflineMode(reason) {
  console.warn("Basculement en mode OFFLINE :", reason);
  setApiMode(API_MODES.OFFLINE);
}

// Fonction demandée par api.js
export function getApiBaseUrl() {
  const mode = getCurrentMode();

  if (mode === API_MODES.ONLINE) {
    return import.meta.env.VITE_API_CLOUD || "https://wkojansthywcaqzpjeqp.supabase.co/functions/v1/smart-service";
  }

  // Mode offline → API locale (ou mocked)
  return import.meta.env.VITE_API_LOCAL || "http://localhost:3001";
}
