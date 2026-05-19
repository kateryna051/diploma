import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { useLanguage } from "../context/LanguageContext";
import { ui } from "../i18n/ui";

// Import images
import wordsImg from "../assets/words.jpg";
import testImg from "../assets/test.jpg";
import gameImg from "../assets/game.jpg";

const ActivityCard: React.FC<{
  title: string;
  img: string;
  onClick: () => void;
}> = ({ title, img, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer w-72 h-80 bg-white rounded-2xl shadow-md hover:shadow-xl transition flex flex-col items-center justify-center"
  >
    <img
      src={img}
      alt={title}
      className="w-36 h-36 rounded-xl object-cover mb-4 transition-transform duration-300 hover:scale-105"
    />
    <p className="text-2xl font-semibold text-gray-800">{title}</p>
  </div>
);

export const CategoryPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const [authenticated, setAuthenticated] = useState(false);

  // Check authentication
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/check", { withCredentials: true })
      .then(() => setAuthenticated(true))
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/auth/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  if (!authenticated)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50 text-gray-700 text-lg">
        Loading...
      </div>
    );

  return (
    <div className="w-screen min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-teal-100 to-emerald-100 text-gray-900">

      {/* Header */}
      <Header onLogout={handleLogout} />

      {/* Main */}
     {/* Main Content */}
  <main className="flex flex-col items-center justify-start w-full py-20 px-6 sm:px-12 md:px-20">

    <h2 className="text-4xl font-semibold text-gray-900 mb-12 relative inline-block">
      {ui[lang].chooseActivity.split(' ').map((word, idx) => (
        <span
          key={idx}
          className="inline-block transform rotate-[-1deg] hover:rotate-[1deg] transition-all mr-3"
        >
          {word}
        </span>
      ))}
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      <ActivityCard
        title={ui[lang].words}
        img={wordsImg}
        onClick={() => navigate(`/category/${id}/words`)}
      />
      <ActivityCard
        title={ui[lang].test}
        img={testImg}
        onClick={() => navigate(`/category/${id}/test`)}
      />
      <ActivityCard
  title={ui[lang].game}
  img={gameImg}
  onClick={() => navigate(`/category/${id}/games`)}
/>


    </div>
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
