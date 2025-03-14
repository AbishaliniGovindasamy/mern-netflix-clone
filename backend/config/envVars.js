import dotenv from "dotenv";
dotenv.config();

export const ENV_VARS = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    TMDB_API_KEY: process.env.TMDB_API_KEY?.trim(), // Trim spaces
};

// Debugging (Does not expose key)
console.log("Loaded TMDB API Key:", ENV_VARS.TMDB_API_KEY ? "✔️ Yes" : "❌ No");
