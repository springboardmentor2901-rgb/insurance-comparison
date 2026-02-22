import express from "express";
const router = express.Router();

// Premium calculator
router.post("/", (req, res) => {
  const { coverage } = req.body;
  const premium = coverage * 0.02;
  res.json({ estimatedPremium: premium });
});

export default router;
