import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

// Base API URL (Use VITE for easy environment switching)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1/auth";

export const useAuthStore = create((set) => ({
    user: null,
    isSigningUp: false,
    isCheckingAuth: true,
    isLoggingIn: false,
    isLoggingOut: false,

    // ✅ Signup Function
    signup: async (credentials) => {
        try {
            set({ isSigningUp: true });
            const response = await axios.post(`${API_BASE_URL}/signup`, credentials, { withCredentials: true });
            set({ user: response.data.user, isSigningUp: false });
            toast.success("🎉 Account created successfully!");
        } catch (error) {
            console.error("Signup Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "❌ Signup failed");
            set({ isSigningUp: false });
        }
    },

    // ✅ Login Function
    login: async (credentials) => {
        try {
            set({ isLoggingIn: true });
            const response = await axios.post(`${API_BASE_URL}/login`, credentials, { withCredentials: true });
            set({ user: response.data.user, isLoggingIn: false });
            toast.success("✅ Logged in successfully!");
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "❌ Login failed");
            set({ isLoggingIn: false });
        }
    },

    // ✅ Logout Function
    logout: async () => {
        try {
            set({ isLoggingOut: true });
            await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
            set({ user: null, isLoggingOut: false });
            toast.success("👋 Logged out successfully!");
        } catch (error) {
            console.error("Logout Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "❌ Logout failed");
            set({ isLoggingOut: false });
        }
    },

    // ✅ Authentication Check Function (FIXED)
    authCheck: async () => {
        try {
            set({ isCheckingAuth: true });
            const response = await axios.get(`${API_BASE_URL}/check`, { withCredentials: true }); // ✅ Fixed endpoint
            set({ user: response.data.user, isCheckingAuth: false });
        } catch (error) {
            console.error("Auth Check Error:", error.response?.data || error.message);
            set({ isCheckingAuth: false, user: null });
        }
    },
}));