import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ENV_VARS } from "../config/envVars.js";

export const protectRoute = async (req, res, next) => {
    try {
        let token = req.cookies["jwt-netflix"]; // 🔹 Get token from cookies

        // ✅ Support Authorization Header (Fallback)
        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            console.warn("⚠️ No Token Found (Cookies or Headers).");
            return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
        }

        console.log("🔑 Received Token:", token);

        // ✅ Verify JWT Token
        let decoded;
        try {
            if (!ENV_VARS.JWT_SECRET) {
                console.error("❌ Missing JWT Secret in ENV_VARS!");
                return res.status(500).json({ success: false, message: "Server Error - Missing JWT Secret" });
            }

            decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
            console.log("✅ Decoded Token:", decoded);
        } catch (err) {
            console.error("❌ JWT Verification Failed:", err.message);
            return res.status(401).json({ success: false, message: "Unauthorized - Invalid or Expired Token" });
        }

        // ✅ Check for User ID in Decoded Token
        if (!decoded?.userId) {
            console.warn("⚠️ Missing User ID in Decoded Token:", decoded);
            return res.status(401).json({ success: false, message: "Unauthorized - Missing User ID" });
        }

        // ✅ Fetch User from Database
        const user = await User.findById(decoded.userId).select("-password -__v");
        if (!user) {
            console.warn("⚠️ User Not Found in DB:", decoded.userId);
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // ✅ Attach User to Request Object
        req.user = user;
        console.log("✅ Authenticated User:", user.email); // Log only necessary details
        next();
    } catch (error) {
        console.error("🔥 Error in protectRoute middleware:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
