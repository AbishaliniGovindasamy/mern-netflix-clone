import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

// Base API URL (Use VITE for easy environment switching)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://mern-netflix-clone-backend.onrender.com/api/v1/auth";

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
            const { data } = await axios.post(`${API_BASE_URL}/signup`, credentials, { withCredentials: true });
            set({ user: data.user, isSigningUp: false });
            toast.success("🎉 Account created successfully!");
        } catch (error) {
            handleAuthError(error, "Signup failed");
            set({ isSigningUp: false });
        }
    },

    // ✅ Login Function
    login: async (credentials) => {
        try {
            set({ isLoggingIn: true });
            const { data } = await axios.post(`${API_BASE_URL}/login`, credentials, { withCredentials: true });
            set({ user: data.user, isLoggingIn: false });
            toast.success("✅ Logged in successfully!");
        } catch (error) {
            handleAuthError(error, "Login failed");
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
            handleAuthError(error, "Logout failed");
            set({ isLoggingOut: false });
        }
    },

    // ✅ Authentication Check Function
    authCheck: async () => {
        try {
            set({ isCheckingAuth: true });
            const { data } = await axios.get(`${API_BASE_URL}/authCheck`, { withCredentials: true });
            set({ user: data.user, isCheckingAuth: false });
        } catch (error) {
            handleAuthError(error, "Authentication check failed");
            set({ isCheckingAuth: false, user: null });
        }
    },
}));

// ✅ Error Handling Function
const handleAuthError = (error, defaultMessage) => {
    console.error(`${defaultMessage}:`, error.response?.data || error.message);
    toast.error(error.response?.data?.message || `❌ ${defaultMessage}`);
};
