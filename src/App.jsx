// src/App.jsx
// Root of the app: wraps everything in AuthProvider (so useAuth() works
// anywhere) and defines all routes. Pages beyond Login/Register are added
// here as they're built — ProtectedRoute guards anything past the dashboard.

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Academic from "./pages/Academic";
import Teachers from "./pages/Teachers";
import Routine from "./pages/Routine";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
// NotFound is added here as it's built.

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/academic"
            element={
              <ProtectedRoute>
                <Academic />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teachers"
            element={
              <ProtectedRoute>
                <Teachers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/routine"
            element={
              <ProtectedRoute>
                <Routine />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<h1 style={{ color: "white", padding: 40 }}>404 — Not Found (placeholder, real page coming)</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
