import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useLanguage } from "../context/LanguageContext";
import { ui } from "../i18n/ui";

export const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Get the logged-in user's email from localStorage
      const email = JSON.parse(localStorage.getItem("user") || "{}").email;

      if (!email) {
        setError("User email not found. Try logging in again.");
        return;
      }

      // Send password change request with email
      await axios.post(
        "http://localhost:8080/api/auth/change-password",
        {
          email,
          currentPassword,
          newPassword,
          confirmNewPassword,
        }
      );

      setSuccess("Password changed successfully! A confirmation email has been sent.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      setError(err.response?.data || "Failed to change password");
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-teal-100 to-emerald-100 text-gray-900">

      <Header />

      <main className="flex flex-col items-center flex-1 w-full py-20 px-6">

        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          {ui[lang].changePasswordTitle}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md border border-sky-200"
        >
          {error && <p className="text-red-600 mb-4">{error}</p>}
{!error && success && <p className="text-green-700 mb-4">{success}</p>}


          <label className="block mb-3">
            <span className="font-medium">{ui[lang].currentPassword}</span>
            <input
              type="password"
              className="mt-1 w-full p-3 border rounded-xl focus:ring-2 focus:ring-sky-400 outline-none"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>

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
            {ui[lang].submit}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-4 w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            {ui[lang].goBack}
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
