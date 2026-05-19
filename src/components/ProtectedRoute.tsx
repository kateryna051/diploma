import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  authenticated: boolean | null;
  children: React.ReactNode;
};

export const ProtectedRoute: React.FC<Props> = ({ authenticated, children }) => {
  if (authenticated === null) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>; // wrap ReactNode
};

export { };