import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
    const [searchParams] = useSearchParams();
    const emailValue = searchParams.get("email") || ""; 

    const [email, setEmail] = useState(emailValue);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { signup, isSigningUp } = useAuthStore();

    const handleSignUp = (e) => {
        e.preventDefault();

        if (!email.trim() || !username.trim() || !password.trim()) {
            console.error("All fields are required!");
            return;
        }

        console.log("Submitting Credentials:", { email, username, password });

        signup({ email, username, password });
    };

    return (
        <div className="h-screen w-full hero-bg flex flex-col items-center justify-center">
            <header className="absolute top-5 left-5">
                <Link to={"/"}>
                    <img src="/netflix-logo.png" alt="logo" className="w-40" />
                </Link>
            </header>

            <div className="w-full max-w-md p-8 space-y-6 bg-black/70 rounded-lg shadow-md">
                <h1 className="text-center text-white text-2xl font-bold mb-4">Sign Up</h1>
                <form className="space-y-4" onSubmit={handleSignUp}>
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-300 block">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                            placeholder="you@example.com"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="username" className="text-sm font-medium text-gray-300 block">
                            Username
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                            placeholder="abishalini"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-300 block">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                            placeholder="*********"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition duration-300"
                        disabled={isSigningUp}
                    >
                        {isSigningUp ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>
                <div className="text-center text-gray-400">
                    Already a member?{" "}
                    <Link to={"/login"} className="text-red-500 hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
