import { useState } from "react";
import BASE from "../api.js";

export default function AuthPanel({ onAuth }) {
    const [screen, setScreen] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${BASE}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password,
                    name,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(
                    data.error?.message || "Something went wrong"
                );
                return;
            }

            setScreen("verify");
        } catch {
            setError("Connection error");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${BASE}/api/auth/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    otp,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(
                    data.error?.message || "Something went wrong"
                );
                return;
            }

            setScreen("login");
            setOtp("");
            setError("");
        } catch {
            setError("Connection error");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${BASE}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(
                    data.error?.message || "Something went wrong"
                );
                return;
            }

            // Only the short-lived access token enters React.
            // The refresh token remains in the HttpOnly cookie.
            onAuth(data.accessToken);
        } catch {
            setError("Connection error");
        } finally {
            setLoading(false);
        }
    };

    const handleGitHubLogin = () => {
        window.location.href = `${BASE}/api/auth/github`;
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md space-y-4">
                <h1 className="text-2xl font-bold text-center text-white">
                    AI Study Assistant
                </h1>

                {/* Login Screen */}
                {screen === "login" && (
                    <>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setScreen("login");
                                    setError("");
                                }}
                                className="flex-1 py-2 rounded-lg text-sm font-medium bg-violet-600 text-white"
                            >
                                Login
                            </button>

                            <button
                                onClick={() => {
                                    setScreen("register");
                                    setError("");
                                }}
                                className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-400 hover:text-white"
                            >
                                Register
                            </button>
                        </div>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-violet-600 placeholder-gray-500"
                        />

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleLogin()
                            }
                            placeholder="Password"
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-violet-600 placeholder-gray-500"
                        />

                        {error && (
                            <p className="text-red-400 text-sm">
                                {error}
                            </p>
                        )}

                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            {loading ? "..." : "Login"}
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="h-px bg-gray-700 flex-1" />
                            <span className="text-gray-500 text-sm">
                                OR
                            </span>
                            <div className="h-px bg-gray-700 flex-1" />
                        </div>

                        <button
                            type="button"
                            onClick={handleGitHubLogin}
                            disabled={loading}
                            className="w-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            Continue with GitHub
                        </button>
                    </>
                )}

                {/* Register Screen */}
                {screen === "register" && (
                    <>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setScreen("login");
                                    setError("");
                                }}
                                className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-400 hover:text-white"
                            >
                                Login
                            </button>

                            <button
                                onClick={() => {
                                    setScreen("register");
                                    setError("");
                                }}
                                className="flex-1 py-2 rounded-lg text-sm font-medium bg-violet-600 text-white"
                            >
                                Register
                            </button>
                        </div>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-violet-600 placeholder-gray-500"
                        />

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-violet-600 placeholder-gray-500"
                        />

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-violet-600 placeholder-gray-500"
                        />

                        {error && (
                            <p className="text-red-400 text-sm">
                                {error}
                            </p>
                        )}

                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            {loading ? "..." : "Register"}
                        </button>
                    </>
                )}

                {/* OTP Verification Screen */}
                {screen === "verify" && (
                    <>
                        <p className="text-gray-400 text-center text-sm">
                            We sent a code to{" "}
                            <span className="text-white">
                                {email}
                            </span>
                        </p>

                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleVerify()
                            }
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-violet-600 placeholder-gray-500 text-center text-xl tracking-widest"
                        />

                        {error && (
                            <p className="text-red-400 text-sm">
                                {error}
                            </p>
                        )}

                        <button
                            onClick={handleVerify}
                            disabled={loading}
                            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            {loading ? "..." : "Verify"}
                        </button>

                        <button
                            onClick={() => {
                                setScreen("register");
                                setError("");
                            }}
                            className="w-full text-gray-400 text-sm hover:text-white"
                        >
                            ← Back to register
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}