// src/components/NoteCard.jsx
// One note's display card: pin toggle, edit, delete. Purely presentational —
// Academic.jsx owns the note data and passes callbacks down.

export default function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  return (
    <div className={`note-card glass-panel ${note.pinned ? "note-card-pinned" : ""}`}>
      <div className="note-card-header">
        <h4>{note.title}</h4>
        <button
          className={`note-pin-btn ${note.pinned ? "note-pin-btn-active" : ""}`}
          onClick={() => onTogglePin(note.id)}
          title={note.pinned ? "Unpin note" : "Pin note"}
          aria-label={note.pinned ? "Unpin note" : "Pin note"}
        >
          ★
        </button>
      </div>
      <p className="note-card-content">{note.content}</p>
      <div className="note-card-footer">
        <span className="note-card-date">
          {new Date(note.updatedAt).toLocaleDateString()}
        </span>
        <div className="note-card-actions">
          <button onClick={() => onEdit(note)}>Edit</button>
          <button onClick={() => onDelete(note.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
