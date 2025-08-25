// src/lib/apiMode.js

export const API_MODES = {
  OFFLINE: "offline",
  ONLINE: "online",
};

// Obtenir le mode actuel
export function getCurrentMode() {
  return localStorage.getItem("apiMode") || API_MODES.OFFLINE;
}

// Changer le mode
export function setApiMode(mode) {
  if (Object.values(API_MODES).includes(mode)) {
    localStorage.setItem("apiMode", mode);

    // Émettre un événement pour informer le reste de l'app
    const event = new Event("apiModeChanged");
    window.dispatchEvent(event);
  }
}

// Forcer le mode offline (ex: erreur réseau, licence invalide)
export function forceOfflineMode(reason) {
  console.warn("Basculement en mode OFFLINE :", reason);
  setApiMode(API_MODES.OFFLINE);
}

// Retourner l’URL de base de l’API selon le mode
export function getApiBaseUrl() {
  const mode = getCurrentMode();

  if (mode === API_MODES.ONLINE) {
    return import.meta.env.VITE_API_CLOUD || "https://wkojansthywcaqzpjeqp.supabase.co";
  }

  return import.meta.env.VITE_API_LOCAL || "http://localhost:3001";
}
