import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { ui } from "../i18n/ui";

export const RegisterForm: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
  });
  const { lang } = useLanguage();

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/register", form);
      setMessage("✅ Registered successfully!");
    } catch {
      setMessage("❌ Registration failed.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white/0 backdrop-blur-sm rounded-xl"
    >
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        {ui[lang].createAccount}
      </h2>

      {/* Name and Surname */}
      <div className="grid grid-cols-2 gap-3">
        <input
          name="name"
          placeholder={ui[lang].name}
          onChange={handleChange}
          className="input"
        />
        <input
          name="surname"
          placeholder={ui[lang].surname}
          onChange={handleChange}
          className="input"
        />
      </div>

      {/* Other fields */}
      <input
        name="phone"
        placeholder={ui[lang].phone}
        onChange={handleChange}
        className="input"
      />
      <input
        name="email"
        type="email"
        placeholder={ui[lang].email}
        onChange={handleChange}
        className="input"
      />
      <input
        name="password"
        type="password"
        placeholder={ ui[lang].password}
        onChange={handleChange}
        className="input"
      />
      <input
        name="confirmPassword"
        type="password"
        placeholder={ui[lang].confirmPassword}
        onChange={handleChange}
        className="input"
      />
      <input
        name="location"
        placeholder={ui[lang].location}
        onChange={handleChange}
        className="input"
      />

      {/* Button */}
      <button
        type="submit"
        className="w-full py-2 text-lg font-semibold rounded-full 
                   bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 
                   text-white shadow-md hover:opacity-90 transition-all"
      >
        { ui[lang].register }
      </button>

      {/* Footer Text */}
      <p className="text-sm text-center text-gray-600">
        {ui[lang].alreadyHaveAccount}{" "}
        <Link to="/login" className="text-sky-600 hover:underline">
          {ui[lang].login}
        </Link>
      </p>

      {message && (
        <p className="text-center mt-2 text-gray-700 font-medium">{message}</p>
      )}
    </form>
  );
};
