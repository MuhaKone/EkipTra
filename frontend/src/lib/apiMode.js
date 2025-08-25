// src/lib/apiMode.js

export const API_MODES = {
  OFFLINE: "offline",
  ONLINE: "online",
};

export const LICENSE_STATUS = {
  VALID: "valid",
  INVALID: "invalid",
  EXPIRED: "expired",
  CHECKING: "checking"
};

// Get current API mode
export function getCurrentMode() {
  return localStorage.getItem("apiMode") || API_MODES.OFFLINE;
}

// Set API mode
export function setApiMode(mode) {
  if (Object.values(API_MODES).includes(mode)) {
    localStorage.setItem("apiMode", mode);
    const event = new Event("apiModeChanged");
    window.dispatchEvent(event);
  }
}

// Get license key
export function getLicenseKey() {
  return localStorage.getItem("licenseKey") || "";
}

// Set license key
export function setLicenseKey(key) {
  localStorage.setItem("licenseKey", key);
}

// Get license status
export function getLicenseStatus() {
  return localStorage.getItem("licenseStatus") || LICENSE_STATUS.INVALID;
}

// Set license status
export function setLicenseStatus(status) {
  localStorage.setItem("licenseStatus", status);
  const event = new CustomEvent("licenseStatusChanged", { detail: status });
  window.dispatchEvent(event);
}

// Force offline mode (if license/server issues)
export function forceOfflineMode(reason) {
  console.warn("⚠️ Basculement forcé en OFFLINE :", reason);
  setApiMode(API_MODES.OFFLINE);
  setLicenseStatus(LICENSE_STATUS.INVALID);
  
  // Notify user
  const event = new CustomEvent("forcedOffline", { detail: reason });
  window.dispatchEvent(event);
}

// Get API base URL based on current mode
export function getApiBaseUrl() {
  const mode = getCurrentMode();

  if (mode === API_MODES.ONLINE) {
    return import.meta.env.VITE_API_CLOUD || "https://equiptracker-cloud.herokuapp.com/api";
  }

  return import.meta.env.VITE_API_LOCAL || "http://localhost:4000/api";
}

// Check if feature is available in current mode
export function isFeatureAvailable(feature) {
  const mode = getCurrentMode();
  
  const offlineFeatures = [
    'equipment.view',
    'equipment.create',
    'equipment.edit',
    'equipment.delete',
    'dashboard.view',
    'reports.basic',
    'export.csv',
    'export.pdf'
  ];
  
  const onlineOnlyFeatures = [
    'sync.realtime',
    'backup.cloud',
    'reports.advanced',
    'analytics.predictive',
    'notifications.email',
    'api.external'
  ];
  
  if (mode === API_MODES.OFFLINE) {
    return offlineFeatures.includes(feature);
  }
  
  return true; // All features available in online mode
}

// Get subscription info
export function getSubscriptionInfo() {
  const mode = getCurrentMode();
  const licenseStatus = getLicenseStatus();
  
  return {
    mode,
    isOnline: mode === API_MODES.ONLINE,
    isLicenseValid: licenseStatus === LICENSE_STATUS.VALID,
    licenseStatus,
    features: {
      maxUsers: mode === API_MODES.ONLINE ? 'unlimited' : 5,
      maxEquipments: mode === API_MODES.ONLINE ? 'unlimited' : 100,
      cloudBackup: mode === API_MODES.ONLINE,
      advancedReports: mode === API_MODES.ONLINE,
      emailNotifications: mode === API_MODES.ONLINE,
      apiAccess: mode === API_MODES.ONLINE
    }
  };
}
