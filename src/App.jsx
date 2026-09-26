import { useEffect, useState, useRef } from "react";
import ExplainPanel from "./components/ExplainPanel";
import QuizPanel from "./components/QuizPanel";
import AuthPanel from "./components/AuthPanel";
import BASE from "./api.js";

export default function App() {
  const [activeTab, setActiveTab] = useState("explain");
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshStarted = useRef(false);

  useEffect(() => {
    if (refreshStarted.current) {
      return;
    }
    refreshStarted.current = true;
    const restoreSession = async () => {
      try {
        const res = await fetch(`${BASE}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) {
          setAccessToken(null);
          return;
        }
        const data = await res.json();
        setAccessToken(data.accessToken);
      } catch {
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Clear local auth state even if logout request fails.
    } finally {
      setAccessToken(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!accessToken) {
    return <AuthPanel onAuth={setAccessToken} />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">AI Study Assistant</h1>

        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-white text-sm"
        >
          Logout
        </button>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        {["explain", "quiz"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              activeTab === tab
                ? "bg-violet-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "explain" ? (
        <ExplainPanel
          accessToken={accessToken}
          setAccessToken={setAccessToken}
        />
      ) : (
        <QuizPanel accessToken={accessToken} setAccessToken={setAccessToken} />
      )}
    </div>
  );
}
