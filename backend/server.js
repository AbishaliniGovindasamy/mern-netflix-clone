import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";
import { protectRoute } from "./middleware/protectRoute.js";

const app = express();
const PORT = ENV_VARS.PORT || 5000;

const __dirname = path.resolve();

// 🔹 CORS Configuration
const allowedOrigins = ["https://mern-netflix-clone-jgig.onrender.com"];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("❌ Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// 🔹 Handle Preflight Requests
app.options("*", cors());

// 🔹 Middleware
app.use(express.json());
app.use(cookieParser());

// 🔹 Debugging Logger (For Development Only)
if (ENV_VARS.NODE_ENV !== "production") {
    app.use((req, res, next) => {
        console.log("🔹 Request:", req.method, req.url);
        console.log("🔹 Headers:", req.headers);
        console.log("🔹 Cookies:", req.cookies);
        next();
    });
}

// 🔹 Routes
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

// 🔹 Serve Frontend (For Production)
if (ENV_VARS.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// 🔹 Test Endpoint for Debugging
app.get("/api/v1/test", (req, res) => {
    res.json({ message: "✅ CORS is working!" });
});

// 🔹 Start Server
app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`🚀 Server Started At http://localhost:${PORT}`);
    } catch (error) {
        console.error("❌ Error connecting to database:", error);
    }
});
