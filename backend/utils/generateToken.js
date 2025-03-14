import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => {
   

        // ✅ Generate JWT Token
        const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "15d" });

        // ✅ Set Cookie with Token
        res.cookie("jwt-netflix", token, {
            httpOnly: true,  // ✅ Prevents XSS attacks
            secure: ENV_VARS.NODE_ENV =! "development", // ✅ Secure in production
            sameSite: "strict", // ✅ Prevents CSRF
            maxAge: 15 * 24 * 60 * 60 * 1000 // ✅ 1 Day Expiration
        });

        // ✅ Debugging Logs
        console.log("✅ Token generated and cookie set successfully!");
        console.log("🔑 Token:", token); // ⚠️ Remove this in production
return token;
   
};
