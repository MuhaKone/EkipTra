import express from "express";
const router = express.Router();

// Exemple simple : stockage clé en variable d'env (ou DB si tu veux plus robuste)
const VALID_LICENSES = (process.env.LICENSE_KEYS || "").split(",");

router.get("/validate", (req, res) => {
  const key = req.query.key;
  if (VALID_LICENSES.includes(key)) {
    return res.json({ valid: true });
  }
  res.json({ valid: false });
});

export default router;
