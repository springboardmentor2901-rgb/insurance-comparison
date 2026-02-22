import express from "express";
import {
  createClaim,
  getClaims,
  getClaimById,
  deleteClaim,
} from "../controllers/claimController.js";

const router = express.Router();

// Create claim
router.post("/", createClaim);

// Get all claims
router.get("/", getClaims);

// Get claim by ID
router.get("/:id", getClaimById);

// Delete claim
router.delete("/:id", deleteClaim);

export default router;