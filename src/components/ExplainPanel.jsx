import { useState } from "react";
import { apiFetch } from "../api.js";

export default function ExplainPanel({ accessToken, setAccessToken }) {
    const [topic, setTopic] = useState("");
    const [mode, setMode] = useState("standard");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleExplain = async () => {
        if (!topic.trim()) return;

        setLoading(true);
        setResponse("");
        setError("");

        try {
            const res = await apiFetch(
                "/api/ai/explain/stream",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ topic, mode }),
                },
                accessToken,
                setAccessToken
            );

            if (!res.ok) {
                const data = await res.json();
                setError(data.error?.message || "Something went wrong");
                return;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(value, {
                    stream: true,
                });

                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;

                    const data = line.slice(6).trim();

                    if (data === "[DONE]") {
                        continue;
                    }

                    try {
                        const parsed = JSON.parse(data);

                        if (parsed.error) {
                            setError(parsed.error);
                        } else if (parsed.token) {
                            setResponse((prev) => prev + parsed.token);
                        }
                    } catch {
                        // Ignore malformed/incomplete SSE chunks.
                    }
                }
            }
        } catch {
            setError("Connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-4">
            <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) =>
                    e.key === "Enter" && handleExplain()
                }
                placeholder="Enter a topic..."
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-violet-600 placeholder-gray-500"
            />

            <div className="flex gap-2">
                {["eli5", "standard", "senior"].map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                            mode === m
                                ? "bg-violet-600 text-white"
                                : "bg-gray-800 text-gray-400 hover:text-white"
                        }`}
                    >
                        {m === "eli5"
                            ? "ELI5"
                            : m === "standard"
                              ? "Standard"
                              : "Senior"}
                    </button>
                ))}
            </div>

            <button
                onClick={handleExplain}
                disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
            >
                {loading ? "Thinking..." : "Explain"}
            </button>

            {error && (
                <p className="text-red-400 text-sm">{error}</p>
            )}

            {response && (
                <div className="bg-gray-800 rounded-lg p-4 text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {response}
                </div>
            )}
        </div>
    );
}