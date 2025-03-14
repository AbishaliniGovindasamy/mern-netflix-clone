import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    "http://localhost:5173", 
    "https://mern-netflix-clone-jgig.onrender.com" // ✅ Your frontend domain
];

// ✅ Properly configure CORS
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Handle Preflight Requests
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Debugging: Log incoming requests
app.use((req, res, next) => {
    console.log("🔹 Request Origin:", req.headers.origin);
    console.log("🔹 Request Method:", req.method);
    next();
});

// Routes
app.use("/api/v1/auth", authRoutes);

app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`🚀 Server running on port ${PORT}`);
    } catch (error) {
        console.error("❌ Database connection error:", error);
    }
});
