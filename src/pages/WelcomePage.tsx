import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/WelcomePage.css";
import { ui } from "../i18n/ui";
import { useLanguage } from "../context/LanguageContext";

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  // GET LANGUAGE FROM CONTEXT
  const { lang, toggleLang } = useLanguage();

  return (
    <div className="welcome-container">

      {/* HEADER */}
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

      {/* MAIN HERO */}
      <main className="hero-section">
        <div className="hero-text">
          <h2>
            {ui[lang].heroTitle}{" "}
            <span className="highlight">Lith&Talk</span>
          </h2>
          <p>{ui[lang].heroSubtitle}</p>

          <div className="cta-buttons">
            <button
              onClick={() => navigate("/register")}
              className="get-started-btn"
            >
              {ui[lang].getStarted}
            </button>
          </div>
        </div>

        <div className="hero-image">
          <div className="glow-bg"></div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="welcome-footer">
        © {new Date().getFullYear()} Lith&Talk | Made with 💙 by{" "}
        <a href="mailto:kate160203@gmail.com">kate160203@gmail.com</a>
      </footer>
    </div>
  );
};
