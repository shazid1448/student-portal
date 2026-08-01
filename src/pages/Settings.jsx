// src/pages/Settings.jsx
// Page 7: Dark/Light mode + accent color (via ThemeContext), a notifications
// toggle (persisted, no real push notifications to wire up — just the
// preference), Reset All Data (clears every Local Storage key after
// confirmation), and Logout.

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme, ACCENTS } from "../context/ThemeContext";
import { clearAllData } from "../utils/localStorage";
import Navbar from "../components/Navbar";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import { useState } from "react";
import "../styles/settings.css";

const ACCENT_COLORS = {
  gold: "#e8b657",
  violet: "#8c7cf0",
  emerald: "#4ade80",
  rose: "#f472b6",
};

export default function Settings() {
  const { logout } = useAuth();
  const { mode, toggleMode, accent, setAccent, notificationsEnabled, setNotificationsEnabled } =
    useTheme();
  const navigate = useNavigate();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [toast, setToast] = useState("");

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function handleResetConfirm() {
    clearAllData();
    setIsResetConfirmOpen(false);
    // Reset wipes the logged-in session too, so send them back to Login.
    navigate("/login", { replace: true });
  }

  return (
    <div className="page-with-navbar">
      <Navbar />

      <main className="settings-content">
        <section className="settings-panel glass-panel">
          <h3>Appearance</h3>

          <div className="settings-row">
            <div>
              <p className="settings-row-label">Dark / Light Mode</p>
              <span className="settings-row-hint">Currently: {mode === "dark" ? "Dark" : "Light"}</span>
            </div>
            <button
              className={`settings-switch ${mode === "light" ? "settings-switch-on" : ""}`}
              onClick={toggleMode}
              aria-label="Toggle dark or light mode"
            >
              <span className="settings-switch-knob" />
            </button>
          </div>

          <div className="settings-row settings-row-column">
            <p className="settings-row-label">Change Theme</p>
            <div className="settings-accent-options">
              {ACCENTS.map((a) => (
                <button
                  key={a}
                  className={`settings-accent-dot ${accent === a ? "settings-accent-dot-active" : ""}`}
                  style={{ background: ACCENT_COLORS[a] }}
                  onClick={() => setAccent(a)}
                  aria-label={`Use ${a} accent`}
                  title={a[0].toUpperCase() + a.slice(1)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="settings-panel glass-panel">
          <h3>Notifications</h3>
          <div className="settings-row">
            <div>
              <p className="settings-row-label">Enable Notifications</p>
              <span className="settings-row-hint">Reminders for tasks and upcoming classes</span>
            </div>
            <button
              className={`settings-switch ${notificationsEnabled ? "settings-switch-on" : ""}`}
              onClick={() => setNotificationsEnabled((v) => !v)}
              aria-label="Toggle notifications"
            >
              <span className="settings-switch-knob" />
            </button>
          </div>
        </section>

        <section className="settings-panel glass-panel settings-panel-danger">
          <h3>Data</h3>
          <div className="settings-row">
            <div>
              <p className="settings-row-label">Reset All Data</p>
              <span className="settings-row-hint">
                Permanently clears everything in Local Storage — your account, notes, tasks,
                routine, and preferences.
              </span>
            </div>
            <button className="settings-danger-btn" onClick={() => setIsResetConfirmOpen(true)}>
              Reset
            </button>
          </div>
        </section>

        <section className="settings-panel glass-panel">
          <div className="settings-row">
            <div>
              <p className="settings-row-label">Log out</p>
              <span className="settings-row-hint">End your current session on this device</span>
            </div>
            <button className="settings-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </section>
      </main>

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset all data?"
        message="This permanently deletes your account and everything stored on this device. This cannot be undone."
        confirmLabel="Reset Everything"
        onConfirm={handleResetConfirm}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      <Toast message={toast} onDismiss={() => setToast("")} />
    </div>
  );
}
