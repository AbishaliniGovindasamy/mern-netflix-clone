import express from "express";
import { signup, authCheck, login, logout } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// 🛡️ **User Authentication Routes**
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/auth/check", protectRoute, authCheck); // Check user authentication

export default router;
