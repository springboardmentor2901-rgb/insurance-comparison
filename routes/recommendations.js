import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  res.json({ recommendation: "Basic Health Plan Recommended" });
});

export default router;
