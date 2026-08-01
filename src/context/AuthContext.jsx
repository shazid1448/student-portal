// src/context/AuthContext.jsx
// Central authentication state. Wraps utils/localStorage.js and exposes
// register/login/logout/updateProfile + the current user, so components
// call useAuth() instead of touching Local Storage directly.

import { createContext, useContext, useState, useEffect } from "react";
import {
  getStudents,
  addStudent,
  updateStudent,
  findStudentByEmail,
  isDuplicateEmail,
  isDuplicateStudentId,
  getAuthUser,
  setAuthUser,
  clearAuthUser,
} from "../utils/localStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, check if someone is already logged in (auto-login).
  useEffect(() => {
    const auth = getAuthUser();
    if (auth?.email) {
      const student = findStudentByEmail(auth.email);
      if (student) {
        setCurrentUser(student);
      } else {
        // Stale auth record pointing at a user that no longer exists.
        clearAuthUser();
      }
    }
    setIsLoading(false);
  }, []);

  function register(formData) {
    if (isDuplicateStudentId(formData.studentId)) {
      return { success: false, error: "This Student ID is already registered." };
    }
    if (isDuplicateEmail(formData.email)) {
      return { success: false, error: "This email is already registered." };
    }
    const saved = addStudent(formData);
    if (!saved) {
      return { success: false, error: "Could not save data. Please try again." };
    }
    return { success: true };
  }

  function login(email, password) {
    const student = findStudentByEmail(email);
    if (!student) {
      return { success: false, error: "No account found with that email." };
    }
    if (student.password !== password) {
      return { success: false, error: "Incorrect password." };
    }
    setAuthUser(student.email);
    setCurrentUser(student);
    return { success: true };
  }

  function logout() {
    clearAuthUser();
    setCurrentUser(null);
  }

  function updateProfile(updates) {
    if (!currentUser) return { success: false, error: "Not logged in." };
    const saved = updateStudent(currentUser.studentId, updates);
    if (saved) {
      setCurrentUser((prev) => ({ ...prev, ...updates }));
    }
    return { success: saved };
  }

  const value = {
    currentUser,
    isLoggedIn: Boolean(currentUser),
    isLoading,
    register,
    login,
    logout,
    updateProfile,
    allStudents: getStudents, // exposed for any future admin-style view
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
