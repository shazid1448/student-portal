// src/components/Toast.jsx
// Small auto-dismissing toast for confirming actions (note saved, task
// deleted, etc.). Each page owns its own toast state and renders one of
// these — simple enough that a global toast queue isn't needed here.

import { useEffect } from "react";
import "../styles/overlay.css";

export default function Toast({ message, type = "success", onDismiss }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(onDismiss, 2500);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`} role="status">
      {message}
    </div>
  );
}
