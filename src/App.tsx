import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import axios from "axios";

import { AuthLayout } from "./pages/AuthLayout";
import { RegisterForm } from "./components/RegisterForm";
import { LoginForm } from "./components/LoginForm";
import { MainPage } from "./pages/Main";
import { WelcomePage } from "./pages/WelcomePage";
import { CategoryPage } from "./pages/CategoryPage";
import { WordsPage } from "./pages/WordsPage";
import { CategoryTest } from "./pages/CategoryTest";
import { LanguageProvider } from "./context/LanguageContext";
import { ChangePasswordPage } from "./pages/ChangePassword";
import { ResetPasswordRequestPage } from "./pages/ResetPasswordRequestPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { AboutPage } from "./pages/AboutPage";
import { TypingChallenge } from "./pages/TypingChallenge";
import { PictureChallenge } from "./pages/PictureChallenge";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ReviewPage from "./pages/ReviewPage";
import { GamesPage } from "./pages/GamesPage";

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  // RUN AUTH ONCE
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/check", { withCredentials: true })
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false));
  }, []);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>

            {/* PUBLIC ROUTES */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Auth pages */}
            <Route element={<AuthLayout />}>
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/login" element={<LoginForm />} />
            </Route>

            {/* Password reset pages (public) */}
            <Route path="/reset-password-request" element={<ResetPasswordRequestPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* PROTECTED ROUTES BELOW */}
            <Route
              path="/main"
              element={
                <ProtectedRoute authenticated={authenticated}>
                  <MainPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/category/:id"
              element={
                <ProtectedRoute authenticated={authenticated}>
                  <CategoryPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/category/:id/words"
              element={
                <ProtectedRoute authenticated={authenticated}>
                  <WordsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/category/:id/test"
              element={
                <ProtectedRoute authenticated={authenticated}>
                  <CategoryTest />
                </ProtectedRoute>
              }
            />

            <Route
              path="/change-password"
              element={
                <ProtectedRoute authenticated={authenticated}>
                  <ChangePasswordPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/category/:id/games/typing-challenge"
              element={
                <ProtectedRoute authenticated={authenticated}>
                  <TypingChallenge />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/category/:id/games"
              element={
                <ProtectedRoute authenticated={authenticated}>
                  <GamesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/category/:id/games/picture-challenge"
              element={
                <ProtectedRoute authenticated={authenticated}>
                  <PictureChallenge />
                </ProtectedRoute>
              }
            />

            <Route path="/reviews" element={
              <ProtectedRoute authenticated={authenticated}>
                <ReviewPage />
              </ProtectedRoute>
            } />

            {/* fallback */}
            <Route path="*" element={<WelcomePage />} />

          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
