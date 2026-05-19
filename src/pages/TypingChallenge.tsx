import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Header } from "../components/Header";
import { useLanguage } from "../context/LanguageContext";
import { ui } from "../i18n/ui";

interface Word {
  id: number;
  lithuanian: string;
  english: string;
  ukrainian: string;
}

interface Answer {
  word: Word;
  userInput: string;
  correct: boolean;
}

export const TypingChallenge: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const [words, setWords] = useState<Word[]>([]);
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [finished, setFinished] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  // Auth check
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/check", { withCredentials: true })
      .then(() => setAuthenticated(true))
      .catch(() => navigate("/login"));
  }, [navigate]);

  // Load words
  useEffect(() => {
    if (!authenticated) return;
    axios
      .get<Word[]>(`http://localhost:8080/api/categories/${id}/words`, { withCredentials: true })
      .then((res) => {
        setWords(res.data);
        setSelectedWords(shuffle(res.data).slice(0, Math.min(15, res.data.length)));
      })
      .catch((err) => console.error(err));
  }, [id, authenticated]);

  if (!authenticated || selectedWords.length === 0)
    return (
      <div className="w-screen h-screen flex items-center justify-center text-gray-700">
        Loading...
      </div>
    );

  const word = selectedWords[currentIndex];

  // Normalize function for accent-insensitive matching
  const normalizeText = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

 const handleSubmit = () => {
  const correctWord = word.lithuanian;
  const normalizeText = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  const isCorrect = normalizeText(input) === normalizeText(correctWord);

  const existingAnswer = answers.find(a => a.word.id === word.id);
  if (!existingAnswer) {
    setAnswers((prev) => [...prev, { word, userInput: input, correct: isCorrect }]);
  } else {
    setAnswers((prev) =>
      prev.map(a => a.word.id === word.id ? { ...a, userInput: input, correct: isCorrect } : a)
    );
  }

  // Clear input
  setInput("");

  // Go to next question or finish
  if (currentIndex + 1 < selectedWords.length) {
    setCurrentIndex((i) => i + 1);
  } else {
    setFinished(true);
  }
};


  // ========================
  // Finished view
  // ========================
  if (finished) {
    const score = answers.filter((a) => a.correct).length;

    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-100 via-teal-100 to-emerald-100 text-gray-900">
        <Header onLogout={() => navigate("/login")} />

        <main className="flex-grow p-10 max-w-3xl mx-auto w-full overflow-auto">
          <h1 className="text-4xl font-bold mb-6">
            {score / selectedWords.length >= 0.7 ? "🎉 You Win!" : "😢 Try Again!"}
          </h1>
          <p className="text-2xl mb-6">
            Score: {score} / {selectedWords.length}
          </p>

          {answers.map((a, i) => (
            <div
              key={i}
              className={`p-4 mb-4 rounded-xl shadow ${
                a.correct ? "bg-teal-100 border-2 border-teal-500" : "bg-rose-100 border-2 border-rose-500"
              }`}
            >
              <p className="font-semibold text-lg">
                {lang === "EN" ? a.word.english : a.word.ukrainian} → {a.word.lithuanian}
              </p>
              <p className={`mt-1 ${a.correct ? "text-green-700" : "text-red-700"}`}>
                Your answer: {a.userInput}
              </p>
            </div>
          ))}

          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-xl"
          >
            {ui[lang].backToCategory}
          </button>
        </main>

        <footer className="w-full py-4 bg-gray-200 text-center mt-auto">
          © 2025 Typing Challenge
        </footer>
      </div>
    );
  }

  // ========================
  // Active challenge view with back/forward
  // ========================
  const currentAnswer = answers.find(a => a.word.id === word.id);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-100 via-teal-100 to-emerald-100 text-gray-900">
      <Header onLogout={() => navigate("/login")} />

      <main className="flex-grow flex flex-col items-center justify-start pt-20 px-4 max-w-xl mx-auto w-full overflow-auto gap-6">
        <div className="w-full bg-white shadow-xl rounded-3xl p-6 flex flex-col items-center gap-4">
          <p className="text-xl font-medium text-gray-800 text-center">
            {lang === "EN" ? word.english : word.ukrainian}
          </p>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Type Lithuanian translation"
            className="w-full p-3 rounded-xl border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          {currentAnswer && (
            <p className={`mt-1 ${currentAnswer.correct ? "text-green-700" : "text-red-700"}`}>
              Previously: {currentAnswer.userInput}
            </p>
          )}
        </div>

        <div className="flex justify-between w-full max-w-xl mt-2 gap-4">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-xl"
            disabled={currentIndex === 0}
          >
            Back
          </button>
          <button
  onClick={() => handleSubmit()}
  className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-xl"
>
  Next
</button>
        </div>

        <p className="text-gray-600 mt-2">
          Question {currentIndex + 1} / {selectedWords.length}
        </p>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white py-5 text-center text-gray-500 shadow-inner mt-auto">
        <p className="text-sm">
          © {new Date().getFullYear()} Lith&Talk | Made with 💙 by{" "}
          <a
            href="mailto:kate160203@gmail.com"
            className="text-gray-700 underline hover:text-gray-900"
          >
            kate160203@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
};

// ========================
// Helpers
// ========================
function shuffle<T>(arr: T[]): T[] {
  return arr.sort(() => Math.random() - 0.5);
}
