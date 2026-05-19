import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useLanguage } from "../context/LanguageContext";
import { ui, categoriesUI } from "../i18n/ui";


export const MainPage: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [categories, setCategories] = useState<
    { id: number; name: string; photoUrl: string }[]
  >([]);

  const navigate = useNavigate();
  const { lang } = useLanguage(); // 🌐 LANGUAGE CONTEXT

  // AUTH CHECK
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/check", { withCredentials: true })
      .then(() => setAuthenticated(true))
      .catch(() => navigate("/login"));
  }, [navigate]);

  // FETCH CATEGORIES
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories", { withCredentials: true })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  // LOGOUT
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
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-sky-100 to-cyan-100 text-gray-700 text-lg">
        Loading...
      </div>
    );

  return (
    <div className="w-screen min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-teal-100 to-emerald-100 text-gray-900 overflow-x-hidden overflow-y-auto">

      {/* 🌍 UNIVERSAL HEADER */}
      <Header onLogout={handleLogout} />

      {/* MAIN CONTENT */}
      <main className="flex flex-col items-center justify-start flex-1 w-full py-20 px-6 sm:px-12 md:px-20">

        {/* 🌐 TRANSLATED PAGE TITLE */}
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          {ui[lang].explore}
        </h2>

        {/* 🌐 TRANSLATED DESCRIPTION */}
        <p className="text-gray-600 mb-14 text-lg text-center max-w-2xl">
          {ui[lang].chooseCategory}
        </p>

        {/* CATEGORIES GRID */}
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14 justify-items-center">

          {categories.length > 0 ? (
  categories.map((cat) => (
    <div
      key={cat.id}
      onClick={() => navigate(`/category/${cat.id}`)}
      className="group relative w-72 h-72 bg-white rounded-3xl shadow-lg
                 flex flex-col justify-center items-center cursor-pointer transition-transform duration-300 hover:-translate-y-2"
    >
      <img
        src={`http://localhost:8080${cat.photoUrl}`}
        alt={cat.name}
        className="w-32 h-32 object-cover rounded-full mb-5 shadow-md transition-transform duration-300 group-hover:scale-105"
      />

      {/* Category name */}
      <p className="text-xl font-semibold text-gray-800 z-10 transition">
        {categoriesUI[cat.id][lang]}
      </p>
    </div>
  ))
) : (
  <p className="text-gray-500 col-span-full text-center text-lg">
    {ui[lang].noCategories}
  </p>
)}
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

      {/* GLOBAL CSS FIXES */}
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          background-color: #e0f2fe;
        }
      `}</style>
    </div>
  );
};
