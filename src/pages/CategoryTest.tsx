import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ui } from "../i18n/ui";
import { Header } from "../components/Header";
import { useLanguage } from "../context/LanguageContext";

interface Word {
  id: number;
  lithuanian: string;
  english: string;
  ukrainian: string;
  exampleSentenceLt: string;
  exampleSentenceEn: string;
  exampleSentenceUa: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: string;
  userAnswer: string | null;
}

export const CategoryTest: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage(); // 🌍 GLOBAL LANGUAGE

  const [authenticated, setAuthenticated] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [finished, setFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Timer
  const [timeLeft, setTimeLeft] = useState(0);

  // 🔐 AUTH CHECK
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/check", { withCredentials: true })
      .then(() => setAuthenticated(true))
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  // LOAD WORDS
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/categories/${id}/words`, { withCredentials: true })
      .then((res) => {
        setWords(res.data);
        generateQuestions(res.data, lang);
      })
      .catch((err) => console.error("Failed to load words", err));
  }, [id]);

  // REGEN ON LANGUAGE SWITCH
  useEffect(() => {
    if (words.length > 0) generateQuestions(words, lang);
  }, [lang]);

  // ===============================
  // QUESTION GENERATOR
  // ===============================
  const generateQuestions = (words: Word[], mode: "EN" | "UA") => {
    const count = 15;
    const timer = 12 * 60; // 12 minutes

    setTimeLeft(timer);
    setFinished(false);
    setCurrentIndex(0);

    const qList: Question[] = [];

    for (let i = 0; i < count; i++) {
      const w = words[Math.floor(Math.random() * words.length)];
      const type = Math.floor(Math.random() * 4);

      let q: Question;

      if (mode === "EN") {
        if (type === 0) {
          const correct = w.lithuanian;
          const wrong = wrongWords(words, w.id, "lithuanian");
          q = {
            id: i,
            question: ui.EN.translateWordToLT + `\n"${w.english}"`,
            options: shuffle([correct, ...wrong]),
            correct,
            userAnswer: null,
          };
        } else if (type === 1) {
          const correct = w.english;
          const wrong = wrongWords(words, w.id, "english");
          q = {
            id: i,
            question: ui.EN.translateWordToEN + `\n"${w.lithuanian}"`,
            options: shuffle([correct, ...wrong]),
            correct,
            userAnswer: null,
          };
        } else if (type === 2) {
          const correct = w.exampleSentenceLt;
          const wrong = wrongSentences(words, w.id, "exampleSentenceLt");
          q = {
            id: i,
            question: ui.EN.translateSentenceToLT + `\n"${w.exampleSentenceEn}"`,
            options: shuffle([correct, ...wrong]),
            correct,
            userAnswer: null,
          };
        } else {
          const correct = w.exampleSentenceEn;
          const wrong = wrongSentences(words, w.id, "exampleSentenceEn");
          q = {
            id: i,
            question: ui.EN.translateSentenceToEN + `\n"${w.exampleSentenceLt}"`,
            options: shuffle([correct, ...wrong]),
            correct,
            userAnswer: null,
          };
        }
      } else {
        // UA MODE
        if (type === 0) {
          const correct = w.lithuanian;
          const wrong = wrongWords(words, w.id, "lithuanian");
          q = {
            id: i,
            question: ui.UA.translateWordToLT + `\n"${w.ukrainian}"`,
            options: shuffle([correct, ...wrong]),
            correct,
            userAnswer: null,
          };
        } else if (type === 1) {
          const correct = w.ukrainian;
          const wrong = wrongWords(words, w.id, "ukrainian");
          q = {
            id: i,
            question: ui.UA.translateWordToUA + `\n"${w.lithuanian}"`,
            options: shuffle([correct, ...wrong]),
            correct,
            userAnswer: null,
          };
        } else if (type === 2) {
          const correct = w.exampleSentenceLt;
          const wrong = wrongSentences(words, w.id, "exampleSentenceLt");
          q = {
            id: i,
            question: ui.UA.translateSentenceToLT + `\n"${w.exampleSentenceUa}"`,
            options: shuffle([correct, ...wrong]),
            correct,
            userAnswer: null,
          };
        } else {
          const correct = w.exampleSentenceUa;
          const wrong = wrongSentences(words, w.id, "exampleSentenceUa");
          q = {
            id: i,
            question: ui.UA.translateSentenceToUA + `\n"${w.exampleSentenceLt}"`,
            options: shuffle([correct, ...wrong]),
            correct,
            userAnswer: null,
          };
        }
      }

      qList.push(q);
    }

    setQuestions(qList);
  };

  // HELPERS
  function shuffle(arr: any[]) {
    return arr.sort(() => Math.random() - 0.5);
  }

  function wrongWords(words: Word[], id: number, field: keyof Word) {
    return words
      .filter((w) => w.id !== id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map((w) => w[field]);
  }

  function wrongSentences(words: Word[], id: number, field: keyof Word) {
    return words
      .filter((w) => w.id !== id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map((w) => w[field]);
  }

  // TIMER
  useEffect(() => {
    if (finished || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, finished]);

  // FINISH TEST
  const finishTest = () => {
    if (questions.some((q) => q.userAnswer === null)) {
      alert("Please answer all questions before finishing.");
      return;
    }
    setFinished(true);
  };

  if (!authenticated || questions.length === 0)
    return <div>Loading...</div>;

  // ==========================
  // RESULTS PAGE
  // ==========================
  if (finished) {
    const score = questions.filter((q) => q.userAnswer === q.correct).length;

    return (
      <div className="w-screen min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-teal-100 to-emerald-100">
        <Header onLogout={handleLogout} />

        <div className="p-10 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">
            {ui[lang].test} — {ui[lang].results}
          </h1>

          <p className="text-xl mb-6">
            {score} / {questions.length}
          </p>

          {questions.map((q, i) => (
            <div key={i} className="bg-white/70 p-4 rounded-xl mb-4 shadow">
              <p className="font-semibold">{i + 1}. {q.question}</p>
              <p>{ui[lang].yourAnswer}: {q.userAnswer}</p>
              <p className="text-teal-700 font-bold">
                {ui[lang].correctAnswer}: {q.correct}
              </p>
            </div>
          ))}

          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-xl"
          >
            {ui[lang].backToCategory}
          </button>
        </div>
      </div>
    );
  }

  // ==========================
  // TEST PAGE
  // ==========================
  const q = questions[currentIndex];

  return (
    <div className="w-screen min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-teal-100 to-emerald-100">

      <Header onLogout={handleLogout} />

      <main className="flex flex-col items-center py-10 px-6 max-w-3xl mx-auto w-full">
        <h2 className="text-3xl font-bold mb-4">{ui[lang].test}</h2>

        <div className="mb-6 text-lg">
          {ui[lang].timeLeft}: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>

        <div className="bg-white/70 p-6 rounded-3xl shadow-xl w-full">
          <h3 className="text-xl font-semibold mb-4">
            Question {currentIndex + 1} / {questions.length}
          </h3>

          <p className="whitespace-pre-line mb-6">{q.question}</p>

          <div className="space-y-3">
            {q.options.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  const updated = [...questions];
                  updated[currentIndex].userAnswer = opt;
                  setQuestions(updated);
                }}
                className={`p-3 rounded-xl border cursor-pointer ${
                  q.userAnswer === opt
                    ? "bg-teal-200 border-teal-500"
                    : "bg-white border-gray-300 hover:bg-gray-100"
                }`}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between w-full mt-6">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
            className="px-6 py-3 bg-gray-300 rounded-xl"
          >
            {ui[lang].back}
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="px-6 py-3 bg-teal-500 text-white rounded-xl"
            >
              {ui[lang].next}
            </button>
          ) : (
            <button
              onClick={finishTest}
              className="px-6 py-3 bg-rose-600 text-white rounded-xl"
            >
              {ui[lang].finishTest}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
