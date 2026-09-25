import { useState } from "react";

export default function AuthPanel({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin ? { email, password } : { email, password, name };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error?.message || "Something went wrong");
      return;
    }

    onAuth(data.accessToken);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-white">
          AI Study Assistant
        </h1>

        <div className="flex gap-2">
          {["Login", "Register"].map((t) => (
            <button
              key={t}
              onClick={() => setIsLogin(t === "Login")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                (isLogin && t === "Login") || (!isLogin && t === "Register")
                  ? "bg-violet-600 text-white"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {!isLogin && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-violet-600 placeholder-gray-500"
          />
        )}

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
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Password"
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-violet-600 placeholder-gray-500"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
        >
          {loading ? "..." : isLogin ? "Login" : "Register"}
        </button>
      </div>
    </div>
  );
}
