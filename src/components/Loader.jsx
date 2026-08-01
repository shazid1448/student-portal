// src/components/Loader.jsx
// Small reusable loading spinner. Used by ProtectedRoute while auth status
// is resolving, and can be reused anywhere else a page needs a loading state.

import "../styles/loader.css";

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="loader-wrap" role="status" aria-live="polite">
      <div className="loader-spinner" />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
