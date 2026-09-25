import { useState } from "react";

export default function QuizPanel({ accessToken }) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [quiz, setQuiz] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setQuiz([]);
    setSelected({});
    setError("");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ topic, numQuestions: 5, difficulty }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error?.message || "Something went wrong");
      return;
    }

    setQuiz(data.quiz);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a topic..."
        className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-violet-600 placeholder-gray-500"
      />

      <div className="flex gap-2">
        {["easy", "medium", "hard"].map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              difficulty === d
                ? "bg-violet-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors"
      >
        {loading ? "Generating..." : "Generate Quiz"}
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {quiz.map((q, i) => (
        <div key={i} className="bg-gray-800 rounded-lg p-4 space-y-3">
          <p className="font-medium text-white">{i + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, j) => {
              const isSelected = selected[i] === opt;
              const isCorrect = opt.startsWith(q.answer);
              const showResult = selected[i] !== undefined;

              return (
                <button
                  key={j}
                  onClick={() => setSelected({ ...selected, [i]: opt })}
                  disabled={selected[i] !== undefined}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    showResult && isCorrect
                      ? "bg-green-700 text-white"
                      : showResult && isSelected
                      ? "bg-red-700 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {selected[i] && (
            <p className="text-sm text-gray-400 mt-2">{q.explanation}</p>
          )}
        </div>
      ))}
    </div>
  );
}