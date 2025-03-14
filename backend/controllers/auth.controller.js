import { User } from '../models/user.models.js';
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';
import zxcvbn from 'zxcvbn';

// Signup Function
export async function signup(req, res) {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (zxcvbn(password).score < 2) {
            return res.status(400).json({ success: false, message: "Password is too weak. Try a stronger password." });
        }

        const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email or Username already exists" });
        }

        const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
        const salt = await bcryptjs.genSalt(saltRounds);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const newUser = new User({ email: email.toLowerCase(), password: hashedPassword, username, image });
        await newUser.save();

        generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            success: true,
            user: { ...newUser._doc, password: "" }
        });
    } catch (error) {
        console.error("Error in Signup controller:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// Login Function
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            success: true,
            user: { ...user._doc, password: "" }
        });
    } catch (error) {
        console.error("Error in Login controller:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// Logout Function
export async function logout(req, res) {
    try {
        res.cookie("jwt-netflix", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            expires: new Date(0)
        });

        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in Logout controller:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// Auth Check
export async function authCheck(req, res) {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        console.error("Error in authCheck controller:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
