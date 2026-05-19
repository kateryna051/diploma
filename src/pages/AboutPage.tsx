import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { ui } from "../i18n/ui";
import { motion } from "framer-motion";
import gameImg from "../assets/games.jpg";
import studyImg from "../assets/study.jpg";
import Header from "../components/Header"; // Logged-in header component
import axios from "axios";

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();
    const { lang, toggleLang } = useLanguage();
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
  axios
    .get("http://localhost:8080/api/auth/check", { withCredentials: true })
    .then(() => {
      setAuthenticated(true);
      setLoading(false);
    })
    .catch(() => {
      setAuthenticated(false);
      setLoading(false); // <- important, otherwise header disappears
    });
}, []);
  return (
    <div className="w-screen min-h-screen flex flex-col bg-gradient-to-br from-teal-100 via-white to-blue-50 text-gray-900">

      {/* HEADER */}
      {loading ? null : authenticated ? (
  <Header />
) : (
  <header
    className="welcome-header"
    style={{
      backgroundColor: "#ffffff", // set header background to white
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)", // optional subtle shadow
    }}
  >
          <h1
            onClick={() => navigate("/")}
            className="text-3xl font-bold cursor-pointer hover:text-gray-700 transition"
          >
            Lith<span className="text-teal-500">&</span>Talk
          </h1>
  
          <nav className="nav-links">
            <button onClick={() => navigate("/about")}>
              {ui[lang].about}
            </button>
          </nav>
  
          <div className="auth-buttons">
            <button
              onClick={toggleLang}
              className="lang-btn"
              style={{
                marginRight: "20px",
                padding: "6px 14px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.5)",
                background: "rgba(255,255,255,0.3)",
                color: "#004",
                fontWeight: 600,
              }}
            >
              {lang}
            </button>
  
            <button onClick={() => navigate("/login")} className="sign-in-btn">
              {ui[lang].signIn}
            </button>
            <button onClick={() => navigate("/register")} className="sign-up-btn">
              {ui[lang].signUp}
            </button>
          </div>
        </header>
)}


      {/* REST OF ABOUT PAGE (unchanged) */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-20 py-20 gap-20">
        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row items-center gap-20 w-full">
          <motion.div
            className="md:w-1/2 w-full rounded-3xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img src={gameImg} alt={ui[lang].aboutTitle} className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            className="md:w-1/2 w-full flex flex-col justify-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold mb-6">{ui[lang].aboutTitle}</h2>
            <p className="text-gray-700 mb-4 text-lg">{ui[lang].aboutParagraph1}</p>
            <p className="text-gray-700 mb-4 text-lg">{ui[lang].aboutParagraph2}</p>
            <p className="text-gray-700 mb-6 text-lg">{ui[lang].aboutParagraph3}</p>
          </motion.div>
        </div>

        {/* LOWER SECTION */}
        <div className="flex flex-col md:flex-row items-center gap-10 w-full mt-10">
          <motion.div
            className="md:w-1/2 w-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold mb-6">{ui[lang].aboutFeaturesTitle}</h3>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li className="flex items-center gap-3">
                <span className="bg-teal-500 text-white rounded-full p-2">
                  <i className="fas fa-check"></i>
                </span>
                {ui[lang].aboutFeature1}
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-teal-500 text-white rounded-full p-2">
                  <i className="fas fa-check"></i>
                </span>
                {ui[lang].aboutFeature2}
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-teal-500 text-white rounded-full p-2">
                  <i className="fas fa-check"></i>
                </span>
                {ui[lang].aboutFeature3}
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="md:w-1/2 w-full rounded-3xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img src={studyImg} alt={ui[lang].aboutTitle} className="w-full h-72 object-cover" />
          </motion.div>
        </div>

        <div className="flex space-x-4 mt-10">
          <a href="#" className="text-gray-400 hover:text-gray-700 transition">
            <i className="fab fa-twitter text-2xl"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-700 transition">
            <i className="fab fa-facebook text-2xl"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-700 transition">
            <i className="fab fa-instagram text-2xl"></i>
          </a>
        </div>
      </main>

      <footer className="w-full bg-white py-5 text-center text-gray-500 shadow-inner mt-auto">
        © {new Date().getFullYear()} Lith&Talk | Made with 💙 by{" "}
        <a href="mailto:kate160203@gmail.com" className="underline hover:text-gray-900">
          kate160203@gmail.com
        </a>
      </footer>
    </div>
  );
};
export default AboutPage;