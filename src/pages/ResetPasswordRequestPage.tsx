import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { ui } from "../i18n/ui";

export const ResetPasswordRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, toggleLang } = useLanguage();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:8080/api/auth/request-password-reset", {
        email,
      });

      setSuccess(
        "✅ Password reset link sent! Check your email (link valid for 1 hour)."
      );
      setEmail("");
    } catch (err: any) {
  if (err.response?.data) {
    // If backend returns an object
    const data = err.response.data;
    // Either show the message property, or stringify
    setError(data.message || JSON.stringify(data));
  } else {
    setError("Failed to send reset link.");
  }
}
  };

  return (
    <div className="w-screen min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-teal-100 to-emerald-100 text-gray-900">
      <header className="
    sticky top-0 w-full flex justify-between items-center
    px-10 py-5 bg-gradient-to-r from-teal-500 via-sky-500 to-cyan-500
    text-white shadow-md border-b border-sky-400 z-20
  ">
    {/* LOGO */}
    <h1
      onClick={() => navigate("/")}
      className="text-3xl font-extrabold cursor-pointer drop-shadow-lg hover:text-sky-100 transition"
    >
      Lith<span className="text-teal-100">&</span>Talk
    </h1>

    {/* LANGUAGE SWITCH */}
    <div className="flex items-center space-x-4">
      <button
        onClick={toggleLang}
        className="bg-white/20 text-sm px-4 py-2 rounded-full border border-white/30 hover:bg-white/30 transition"
      >
        {lang}
      </button>
    </div>
  </header>

      <main className="flex flex-col items-center flex-1 w-full py-20 px-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          {ui[lang].forgotPasswordTitle || "Forgot Password"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md border border-sky-200"
        >
          {error && <p className="text-red-600 mb-4">{error}</p>}
          {success && <p className="text-green-700 mb-4">{success}</p>}

          <label className="block mb-6">
            <span className="font-medium">{ui[lang].email || "Email"}</span>
            <input
              type="email"
              className="mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-sky-400 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {ui[lang].sendResetLink || "Send Reset Link"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-4 w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            {ui[lang].goBack || "Go Back"}
          </button>
        </form>
      </main>

      <footer className="w-full bg-gradient-to-r from-sky-500 via-teal-500 to-cyan-500 py-5 text-center text-white shadow-inner">
        <p className="text-sm">
          © {new Date().getFullYear()} Lith&Talk | Made with 💙 by{" "}
          <a
            href="mailto:kate160203@gmail.com"
            className="text-white underline-offset-2 hover:underline"
          >
            kate160203@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
};

export default ResetPasswordRequestPage;
