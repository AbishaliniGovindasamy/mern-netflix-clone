import express from "express";
import { 
    getTrendingTv, 
    getTvTrailers, 
    getTvDetails, 
    getSimilarTvs, 
    getTvsByCategory 
} from "../controllers/tv.controller.js";
import { protectRoute } from "../middleware/protectRoute.js"; 

const router = express.Router();

// Public Routes - Available to all users
router.get("/trending", getTrendingTv);
router.get("/category/:category", getTvsByCategory); // 🔓 Public access

// Protected Routes - Require authentication
router.get("/:id/trailers", protectRoute, getTvTrailers);
router.get("/:id/details", protectRoute, getTvDetails);
router.get("/:id/similar", protectRoute, getSimilarTvs);

export default router;
