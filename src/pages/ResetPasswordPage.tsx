import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { useLanguage } from "../context/LanguageContext";
import { ui } from "../i18n/ui";


export const ResetPasswordPage: React.FC = () => {
const { toggleLang } = useLanguage();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const { token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) return;

    try {
      await axios.post(`http://localhost:8080/api/auth/reset-password?token=${token}`, {
        newPassword,
        confirmNewPassword,
      });

      setSuccess("✅ Password reset successfully! You can now log in.");
      setNewPassword("");
      setConfirmNewPassword("");

      setTimeout(() => navigate("/login"), 3000); // redirect after 3s
    } catch (err: any) {
      setError(err.response?.data || "Failed to reset password.");
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
          {ui[lang].resetPasswordTitle || "Reset Password"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md border border-sky-200"
        >
          {error && <p className="text-red-600 mb-4">{error}</p>}
          {success && <p className="text-green-700 mb-4">{success}</p>}

          <label className="block mb-3">
            <span className="font-medium">{ui[lang].newPassword}</span>
            <input
              type="password"
              className="mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-sky-400 outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>

          <label className="block mb-6">
            <span className="font-medium">{ui[lang].confirmNewPassword}</span>
            <input
              type="password"
              className="mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-sky-400 outline-none"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {ui[lang].submit || "Reset Password"}
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

export default ResetPasswordPage;
