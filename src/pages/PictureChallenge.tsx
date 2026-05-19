import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useLanguage } from "../context/LanguageContext";
import { ui } from "../i18n/ui";

interface Word {
  id: number;
  lithuanian: string;
  english: string;
  ukrainian: string;
  imageUrl: string;
}

interface Answer {
  word: Word;
  userAnswer: string;
  correct: boolean;
}

export const PictureChallenge: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const [words, setWords] = useState<Word[]>([]);
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [finished, setFinished] = useState(false);

  // Load words
  useEffect(() => {
    axios
      .get<Word[]>(`http://localhost:8080/api/categories/${id}/words`, { withCredentials: true })
      .then((res) => {
        setWords(res.data);
        setSelectedWords(shuffle(res.data).slice(0, Math.min(15, res.data.length)));
      })
      .catch(console.error);
  }, [id]);

  const word = selectedWords[currentIndex];

  // =========================
  // OPTIONS: Memoized so they never change
  // =========================
  const options = useMemo(() => {
    if (!word) return [];
    const otherWords = shuffle(words.filter((w) => w.id !== word.id)).slice(0, 3);
    return shuffle([word.lithuanian, ...otherWords.map((w) => w.lithuanian)]);
  }, [words, word]);

  const handleSelect = (option: string) => {
    if (!word) return;
    const isCorrect = word.lithuanian === option;
    setAnswers((prev) => [...prev, { word, userAnswer: option, correct: isCorrect }]);
    if (currentIndex + 1 < selectedWords.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  };

  if (!word) return <div className="w-screen h-screen flex items-center justify-center">Loading...</div>;

  // =========================
  // FINISHED VIEW
  // =========================
  if (finished) {
    const score = answers.filter((a) => a.correct).length;
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-100 via-teal-100 to-emerald-100">
        <Header onLogout={() => navigate("/login")} />
        <main className="flex-grow p-10 max-w-5xl mx-auto w-full overflow-auto">
  <h1 className="text-4xl font-bold mb-6">
    {score / selectedWords.length >= 0.7 ? "🎉 You Win!" : "😢 Try Again!"}
  </h1>
  <p className="text-2xl mb-6">{score} / {selectedWords.length}</p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {answers.map((a, i) => (
      <div
        key={i}
        className={`flex flex-col items-center p-4 rounded-xl shadow ${
          a.correct
            ? "bg-teal-100 border-2 border-teal-500"
            : "bg-rose-100 border-2 border-rose-500"
        }`}
      >
        {/* Fixed-size image */}
        <div className="w-full h-48 overflow-hidden rounded-xl mb-4">
          <img
            src={`http://localhost:8080${a.word.imageUrl}?v=${a.word.id}`}
            alt="word image"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text content */}
        <div className="w-full text-center">
          <p className="font-semibold truncate">{ui[lang].yourAnswer}: {a.userAnswer}</p>
          <p className="truncate">{ui[lang].correctAnswer}: {a.word.lithuanian}</p>
        </div>
      </div>
    ))}
  </div>

  <button
    onClick={() => navigate(-1)}
    className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-xl"
  >
    {ui[lang].backToCategory}
  </button>
</main>

      </div>
    );
  }

  // =========================
  // ACTIVE QUESTION VIEW
  // =========================
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-100 via-teal-100 to-emerald-100">
      <Header onLogout={() => navigate("/login")} />
      <main className="flex-grow flex flex-col items-center justify-start pt-20 px-4 max-w-xl mx-auto w-full gap-6">
        <p className="text-xl font-semibold">
          {ui[lang].translateWordToLT} {/* Question changes with language */}
        </p>
        <img
          src={`http://localhost:8080${word.imageUrl}`}
          alt={word.lithuanian}
          className="w-full h-64 object-contain rounded-xl shadow-lg"
        />
        <div className="grid grid-cols-2 gap-4 w-full">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className="p-4 bg-white rounded-xl shadow hover:bg-teal-200 text-gray-800 font-semibold"
            >
              {opt}
            </button>
          ))}
        </div>
        <p className="text-gray-600 mt-2">
          {ui[lang].question}: {currentIndex + 1} / {selectedWords.length}
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

// =========================
// HELPERS
// =========================
function shuffle<T>(arr: T[]): T[] {
  return arr.sort(() => Math.random() - 0.5);
}
