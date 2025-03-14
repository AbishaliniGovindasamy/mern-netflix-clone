import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { protectRoute } from "./middleware/protectRoute.js";
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";
import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import path from "path";

const app = express();
const PORT = ENV_VARS.PORT;

const __dirname = path.resolve();

// ✅ Fix: Proper CORS Configuration
const allowedOrigins = [
    "http://localhost:5173", // Local development
    "https://mern-netflix-clone-jgig.onrender.com", // Render Frontend URL
    // Add other frontend URLs if needed
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Fix: Allow Preflight Requests for All Routes
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(cookieParser());

// Request Logger
app.use((req, res, next) => {
    console.log("🔹 Incoming Request:", req.method, req.url);
    console.log("🔹 Cookies:", req.cookies);
    next();
});

// API Routes
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

// Serve Frontend in Production
if (ENV_VARS.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// Auth Check Endpoint
app.get("/api/v1/auth/authCheck", (req, res) => {
    const token = req.cookies["jwt-netflix"];
    if (!token) {
        return res.status(401).json({ message: "❌ No token found in cookies!" });
    }
    res.json({ message: "✅ Token exists!", token });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
});

// Server Initialization
app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`🚀 Server Started At http://localhost:${PORT}`);
    } catch (error) {
        console.error("❌ Error connecting to database:", error);
    }
});