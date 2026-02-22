import express from "express";
import { registerUser, getUsers } from "../controllers/authController.js";

const router = express.Router();

// Register user
router.post("/register", registerUser);

// Get all users
router.get("/", getUsers);

export default router;