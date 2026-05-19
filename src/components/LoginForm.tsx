import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { ui } from "../i18n/ui";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return; // prevent double submit

    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        form,
        { withCredentials: true }
      );

      const loggedUser = res.data;

      // store data ONLY on success
      localStorage.setItem("userId", String(loggedUser.userId));
      localStorage.setItem("userName", loggedUser.name);
      localStorage.setItem("userSurname", loggedUser.surname);
      localStorage.setItem("token", loggedUser.token);
      localStorage.setItem("user", JSON.stringify({ email: form.email }));

      setMessage(ui[lang].loginSuccessful);
      setIsLoggedIn(true);
    } catch (err) {
      setMessage(ui[lang].invalidCredentials);
    } finally {
      setLoading(false);
    }
  };

  // ✅ navigate ONLY after login is confirmed
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/main", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        {ui[lang].welcomeBack}
      </h2>

      <input
        name="email"
        type="email"
        placeholder={ui[lang].email}
        value={form.email}
        onChange={handleChange}
        className="input"
        required
      />

      <input
        name="password"
        type="password"
        placeholder={ui[lang].password}
        value={form.password}
        onChange={handleChange}
        className="input"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 text-lg font-semibold rounded-full 
                   bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 
                   text-white shadow-md hover:opacity-90 transition-all
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? ui[lang].loggingIn : ui[lang].login}
      </button>

      <p className="text-sm text-center text-gray-600 mt-2">
        {ui[lang].forgetPassword}{" "}
        <button
          type="button"
          onClick={() => navigate("/reset-password-request")}
          className="text-sky-600 hover:underline"
        >
          {ui[lang].clickHere}
        </button>
      </p>

      <p className="text-sm text-center text-gray-600 mt-2">
        {ui[lang].donthaveAccount}{" "}
        <Link to="/register" className="text-sky-600 hover:underline">
          {ui[lang].register}
        </Link>
      </p>

      {message && (
        <p className="text-center mt-2 text-gray-700 font-medium">
          {message}
        </p>
      )}
    </form>
  );
};

export default LoginForm;
