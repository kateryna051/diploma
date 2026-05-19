import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const GameSelector: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Randomly pick TypingChallenge or PictureChallenge
    const games = ["typing-challenge", "picture-challenge"];
    const choice = games[Math.floor(Math.random() * games.length)];
    navigate(`/category/${id}/${choice}`);
  }, [id, navigate]);

  return (
    <div className="w-screen h-screen flex items-center justify-center text-gray-700">
      Loading game...
    </div>
  );
};
