import { useState } from "react";
import ExplainPanel from "./components/ExplainPanel";
import QuizPanel from "./components/QuizPanel";
import AuthPanel from "./components/AuthPanel";

export default function App() {
  const [activeTab, setActiveTab] = useState("explain");
  const [accessToken, setAccessToken] = useState(null);

  if (!accessToken) {
    return <AuthPanel onAuth={setAccessToken} />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">AI Study Assistant</h1>
        <button
          onClick={() => setAccessToken(null)}
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

      {activeTab === "explain"
        ? <ExplainPanel accessToken={accessToken} />
        : <QuizPanel accessToken={accessToken} />}
    </div>
  );
}