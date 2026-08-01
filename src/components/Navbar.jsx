// src/components/Navbar.jsx
// Fixed top nav shown on every authenticated page. Highlights the active
// link, collapses to a hamburger menu on small screens, and calls
// AuthContext.logout() (which clears Local Storage session and redirects).

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

const LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/academic", label: "Academic" },
  { to: "/teachers", label: "Teachers" },
  { to: "/routine", label: "Routine" },
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" },
];

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-brand">Student Portal</div>

      <button
        className="navbar-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`navbar-links ${isMenuOpen ? "navbar-links-open" : ""}`}>
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `navbar-link ${isActive ? "navbar-link-active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
        <button className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}