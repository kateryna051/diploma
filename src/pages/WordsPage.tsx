import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { useLanguage } from "../context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface Word {
  id: number;
  lithuanian: string;
  english: string;
  ukrainian: string;
  exampleSentenceLt: string;
  exampleSentenceEn: string;
  exampleSentenceUa: string;
  imageUrl: string;
  audioUrl: string;
}

export const WordsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const [authenticated, setAuthenticated] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingImage, setLoadingImage] = useState(true);

  // AUTH CHECK
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/check", { withCredentials: true })
      .then(() => setAuthenticated(true))
      .catch(() => navigate("/login"));
  }, [navigate]);

  // FETCH WORDS
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/categories/${id}/words`, {
        withCredentials: true,
      })
      .then((res) => {
        setWords(res.data);
        if (res.data.length > 0) {
          preloadImage(res.data[0].imageUrl, () => {
            setSelectedWord(res.data[0]);
            setCurrentIndex(0);
          });
        }
      })
      .catch((err) => console.error("Failed to load words", err));
  }, [id]);

  // Preload image helper
  const preloadImage = (url: string, callback: () => void) => {
    setLoadingImage(true);
    const img = new Image();
    img.src = `http://localhost:8080${url}`;
    img.onload = () => {
      callback();
      setLoadingImage(false);
    };
  };

  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      const next = words[currentIndex + 1];
      preloadImage(next.imageUrl, () => {
        setCurrentIndex(currentIndex + 1);
        setSelectedWord(next);
      });
    }
  };

  const prevWord = () => {
    if (currentIndex > 0) {
      const prev = words[currentIndex - 1];
      preloadImage(prev.imageUrl, () => {
        setCurrentIndex(currentIndex - 1);
        setSelectedWord(prev);
      });
    }
  };

  if (!authenticated)
    return (
      <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-sky-100 to-cyan-100 text-gray-700 text-lg overflow-y-auto">
        Loading...
      </div>
    );

  return (
    <div className="w-screen min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-teal-100 to-emerald-100 text-gray-900 overflow-x-hidden overflow-y-auto">
      {/* GLOBAL HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <div className="flex w-full px-10 py-10 gap-10">
        {/* LEFT: Selected Word */}
        <div className="w-2/3 bg-white/70 rounded-3xl p-10 shadow-lg border border-teal-200 backdrop-blur-sm flex flex-col items-center text-center">
          {selectedWord ? (
            <>
              {/* WORD + AUDIO */}
              <div className="flex items-center gap-6 mb-6">
                <h2 className="text-4xl font-bold text-teal-700">
                  {selectedWord.lithuanian}
                </h2>

                <audio
                  controls
                  src={`http://localhost:8080${selectedWord.audioUrl}`}
                  className="h-10"
                >
                  Your browser does not support audio.
                </audio>
              </div>

              {/* IMAGE + ARROWS */}
              <div className="relative w-full flex items-center justify-center mb-6">
                <button
                  onClick={prevWord}
                  disabled={currentIndex === 0}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 px-4 py-3 rounded-full text-3xl font-bold shadow-md
                  ${
                    currentIndex === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-teal-500 text-white hover:bg-teal-600"
                  }`}
                >
                  &lt;
                </button>

                <div className="w-64 h-64 relative">
                  <AnimatePresence mode="wait">
                    {!loadingImage && (
                      <motion.img
                        key={selectedWord.id}
                        src={`http://localhost:8080${selectedWord.imageUrl}`}
                        alt={selectedWord.lithuanian}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="w-64 h-64 object-cover rounded-3xl shadow-md border-2 border-sky-300 mx-auto absolute top-0 left-0"
                      />
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={nextWord}
                  disabled={currentIndex === words.length - 1}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 px-4 py-3 rounded-full text-3xl font-bold shadow-md
                  ${
                    currentIndex === words.length - 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-teal-500 text-white hover:bg-teal-600"
                  }`}
                >
                  &gt;
                </button>
              </div>

              {/* TRANSLATION BASED ON LANGUAGE */}
              <p className="text-xl text-gray-800">
                {lang === "EN" ? selectedWord.english : selectedWord.ukrainian}
              </p>

              {/* Lithuanian always present */}
              <p className="text-xl text-gray-800 font-semibold text-teal-700 mt-2">
                {selectedWord.lithuanian}
              </p>

              {/* SENTENCES */}
              <div className="mt-6 text-left w-full max-w-xl mx-auto">
                <h3 className="text-2xl font-semibold mb-3 text-teal-700">
                  Example
                </h3>

                <p className="text-lg text-gray-700 mb-1">
                  {selectedWord.exampleSentenceLt}
                </p>

                <p className="text-lg text-gray-700 mb-1">
                  {lang === "EN"
                    ? selectedWord.exampleSentenceEn
                    : selectedWord.exampleSentenceUa}
                </p>
              </div>
            </>
          ) : (
            <p>No words found.</p>
          )}
        </div>

        {/* RIGHT: Words List */}
        <div className="w-1/3 bg-white/60 rounded-3xl p-6 shadow-lg border border-sky-200 overflow-y-auto max-h-[80vh]">
          <h3 className="text-2xl font-bold text-gray-700 mb-4">Words</h3>

          <div className="flex flex-col gap-4">
            {words.map((w, index) => (
              <div
                key={w.id}
                onClick={() => {
                  preloadImage(w.imageUrl, () => {
                    setSelectedWord(w);
                    setCurrentIndex(index);
                  });
                }}
                className={`p-4 rounded-xl cursor-pointer transition shadow-md border
                ${
                  selectedWord?.id === w.id
                    ? "bg-teal-100 border-teal-400"
                    : "bg-white border-sky-200 hover:bg-sky-100"
                }`}
              >
                <p className="text-xl font-semibold text-gray-800">
                  {w.lithuanian}
                </p>

                <p className="text-sm text-gray-600">
                  {lang === "EN" ? w.english : w.ukrainian}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

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
