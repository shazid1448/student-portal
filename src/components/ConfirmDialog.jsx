// src/components/ConfirmDialog.jsx
// Reusable "are you sure?" modal. Used before any destructive action
// (deleting a note, task, routine entry, or resetting all data in Settings)
// so nothing gets deleted from Local Storage without an explicit confirm.

import "../styles/overlay.css";

export default function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="overlay-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="overlay-panel glass-panel">
        <h3>{title}</h3>
        {message && <p className="overlay-message">{message}</p>}
        <div className="overlay-actions">
          <button className="overlay-btn overlay-btn-ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="overlay-btn overlay-btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
