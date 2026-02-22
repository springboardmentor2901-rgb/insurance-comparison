import express from "express";
import {
  generateQuote,
  getQuotes,
} from "../controllers/quoteController.js";

const router = express.Router();

// Generate quote
router.post("/", generateQuote);

// Get all quote
router.get("/", getQuotes);

export default router;