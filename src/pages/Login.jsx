// src/pages/Login.jsx
// Combined entry point for returning users. Auto-redirects to /dashboard if
// already logged in (per AuthContext). On submit, validates the form, then
// delegates the actual credential check to AuthContext.login().

import { useState, useEffect } from "react";
import { Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validateLoginForm } from "../utils/validation";
import "../styles/auth.css";

export default function Login() {
  const { login, isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear the top-level error whenever the person edits a field again.
  useEffect(() => {
    if (submitError) setSubmitError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  if (!isLoading && isLoggedIn) {
    const redirectTo = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    // Local Storage is synchronous, but a tiny delay lets the loading state
    // actually render instead of flashing — mirrors what a real backend feels like.
    setTimeout(() => {
      const result = login(formData.email, formData.password);
      setIsSubmitting(false);
      if (!result.success) {
        setSubmitError(result.error);
        return;
      }
      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    }, 300);
  }

  return (
    <div className="auth-page">
      <div className="auth-side glass-panel">
        <div className="auth-side-glow" aria-hidden="true" />
        <div className="auth-id-card" aria-hidden="true">
          <div className="auth-id-card-stripe" />
          <div className="auth-id-card-row">
            <div className="auth-id-card-avatar" />
            <div>
              <div className="auth-id-card-line auth-id-card-line-wide" />
              <div className="auth-id-card-line" />
            </div>
          </div>
        </div>
        <h1 className="auth-side-title">Student Portal</h1>
        <p className="auth-side-copy">
          One place for your notes, routine, tasks, and everything else this
          semester throws at you.
        </p>
      </div>

      <div className="auth-form-side">
        <form className="glass-panel auth-form" onSubmit={handleSubmit} noValidate>
          <h2 className="auth-form-title">Welcome back</h2>
          <p className="auth-form-subtitle">Log in to continue to your dashboard.</p>

          {submitError && <div className="auth-alert auth-alert-error">{submitError}</div>}

          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@university.edu"
              autoComplete="email"
            />
            {errors.email && <small className="auth-field-error">{errors.email}</small>}
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && <small className="auth-field-error">{errors.password}</small>}
          </label>

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>

          <p className="auth-switch">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
