import express from "express";
const router = express.Router();

// Valid license keys (in production, store in database)
const VALID_LICENSES = [
  "LIC-DEMO-2025-FREE",
  "LIC-STARTER-2025-001",
  "LIC-PRO-2025-001",
  "LIC-ENTERPRISE-2025-001"
];

// License tiers and features
const LICENSE_TIERS = {
  "LIC-DEMO-2025-FREE": {
    tier: "demo",
    maxUsers: 5,
    maxEquipments: 50,
    features: ["basic_reports", "csv_export"],
    expiresAt: "2025-12-31"
  },
  "LIC-STARTER-2025-001": {
    tier: "starter",
    maxUsers: 10,
    maxEquipments: 100,
    features: ["basic_reports", "csv_export", "pdf_export", "cloud_backup"],
    expiresAt: "2026-01-31"
  },
  "LIC-PRO-2025-001": {
    tier: "professional",
    maxUsers: -1, // unlimited
    maxEquipments: -1,
    features: ["all"],
    expiresAt: "2026-01-31"
  }
};

router.get("/validate", (req, res) => {
  const key = req.query.key;
  
  if (!key) {
    return res.status(400).json({ valid: false, error: "License key required" });
  }
  
  if (VALID_LICENSES.includes(key)) {
    const licenseInfo = LICENSE_TIERS[key];
    
    // Check expiration
    if (licenseInfo?.expiresAt) {
      const expirationDate = new Date(licenseInfo.expiresAt);
      const now = new Date();
      
      if (now > expirationDate) {
        return res.json({ 
          valid: false, 
          error: "License expired",
          expiresAt: licenseInfo.expiresAt
        });
      }
    }
    
    return res.json({ 
      valid: true,
      tier: licenseInfo?.tier || "unknown",
      features: licenseInfo?.features || [],
      maxUsers: licenseInfo?.maxUsers || 5,
      maxEquipments: licenseInfo?.maxEquipments || 50,
      expiresAt: licenseInfo?.expiresAt
    });
  }
  
  res.json({ 
    valid: false, 
    error: "Invalid license key" 
  });
});

export default router;
