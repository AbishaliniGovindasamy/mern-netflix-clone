// routes/movie.routes.js
import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    getTrendingMovies,
    getMovieTrailers,
    getMovieDetails,
    getSimilarMovies,
    getMoviesByCategory,
} from "../controllers/movie.controller.js";

const router = express.Router();

// Public Routes - Available to all users
router.get("/trending", getTrendingMovies);
router.get("/category/:category", getMoviesByCategory);
router.get("/:id/details", getMovieDetails); // ✅ Made Public
router.get("/:id/similar", getSimilarMovies); // ✅ Made Public

// Protected Routes - Require authentication
router.get("/:id/trailers", protectRoute, getMovieTrailers); 

export default router;
