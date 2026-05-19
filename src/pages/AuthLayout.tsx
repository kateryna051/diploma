import React from "react";
import { Outlet } from "react-router-dom";
import logo from "../assets/logo.png";
import { useLanguage } from "../context/LanguageContext";
import { ui } from "../i18n/ui";

export const AuthLayout: React.FC = () => {
  const { lang, toggleLang } = useLanguage();

  return (
    <div className="fixed inset-0 flex w-screen h-screen bg-gradient-to-br from-teal-100 via-cyan-100 to-sky-100 overflow-hidden">

      {/* Language button (top-right) */}
      <button
        onClick={toggleLang}
        className="absolute top-6 right-6 z-50 bg-white px-4 py-2 rounded-full shadow border text-sm hover:bg-gray-100"
      >
        {lang}
      </button>

      {/* Left Section */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-sky-500 via-teal-500 to-emerald-500 text-white p-12 relative">
        <img src={logo} alt="Lith&Talk Logo" className="w-32 h-32 mb-8" />
        <h1 className="text-5xl font-extrabold mb-4">
          Lith<span className="text-sky-100">&</span>Talk
        </h1>
        <p className="text-lg text-center max-w-sm">
          {ui[lang].litlearn}
        </p>
      </div>

      {/* Right Section */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-white/70">
        <div className="w-full max-w-md p-10 rounded-2xl shadow-xl bg-white/90">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;