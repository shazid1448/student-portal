// src/components/ProtectedRoute.jsx
// Route guard: renders its children only if the user is logged in
// (per AuthContext, backed by Local Storage). Otherwise redirects to /login,
// remembering the page they tried to visit so we can send them back after login.

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
