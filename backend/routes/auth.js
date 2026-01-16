import express from "express";
import { register, login, getMe } from "../controllers/authController.js";

const router = express.Router();

// Register new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Get current user (verify token)
router.get("/me", getMe);

export default router;
