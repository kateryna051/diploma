import React from "react";
import { useNavigate, useParams } from "react-router-dom"; // <-- useParams added
import { useLanguage } from "../context/LanguageContext";
import { ui } from "../i18n/ui";

// Import game images
import typingImg from "../assets/typing.jpg";
import pictureImg from "../assets/picture.jpg";
import { Header } from "../components/Header";

const GameCard: React.FC<{
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

export const GamesPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
    const { id } = useParams<{ id: string }>();


  const games = [
    { title: ui[lang].typingChallenge, path: "typing-challenge", img: typingImg },
    { title: ui[lang].pictureChallenge, path: "picture-challenge", img: pictureImg },
  ];

  return (
    <div className="w-screen min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-teal-100 to-emerald-100 text-gray-900">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center justify-start w-full py-20 px-6 sm:px-12 md:px-20">
        <h2 className="text-4xl font-semibold text-gray-900 mb-12">
          {ui[lang].chooseGame}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {games.map((game) => (
            <GameCard
              key={game.path}
              title={game.title}
              img={game.img}
              onClick={() => navigate(`/category/${id}/games/${game.path}`)} // pass categoryId dynamically
            />
          ))}
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

export default GamesPage;
