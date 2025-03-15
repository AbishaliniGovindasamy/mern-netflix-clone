import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { protectRoute } from "./middleware/protectRoute.js";
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";
import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = ENV_VARS.PORT || 5000;
const __dirname = path.resolve();

// ✅ **Dynamic CORS (Handles both Local & Deployed Frontend)**
app.use(cors({
    origin: ENV_VARS.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));

// ✅ **Middleware**
app.use(express.json());
app.use(cookieParser());

// ✅ **Request Logger (For Debugging)**
app.use((req, res, next) => {
    console.log("🔹 Incoming Request:", req.method, req.url);
    console.log("🔹 Cookies:", req.cookies);
    next();
});

// ✅ **API Routes**
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

// ✅ **Frontend Deployment Handling (For Render)**
if (ENV_VARS.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend", "dist")));
    
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// ✅ **Auth Check Route**
app.get("/api/v1/auth/authCheck", (req, res) => {
    const token = req.cookies["jwt-netflix"];
    if (!token) {
        return res.status(401).json({ message: "❌ No token found in cookies!" });
    }
    res.json({ message: "✅ Token exists!", token });
});

// ✅ **Server Initialization**
app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`🚀 Server started on: http://localhost:${PORT}`);
    } catch (error) {
        console.error("❌ Database connection failed:", error);
    }
});
