// src/pages/Routine.jsx
// Page 5: students build their own weekly class routine. Stored per-student
// via utils/localStorage.js (getRoutines/saveRoutines) — the same key
// Dashboard's "Today's Routine" and the live Countdown already read from,
// so entries added here show up there immediately.

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getRoutines, saveRoutines } from "../utils/localStorage";
import Navbar from "../components/Navbar";
import RoutineTable from "../components/RoutineTable";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import "../styles/routine.css";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const emptyForm = {
  courseName: "",
  teacherName: "",
  classroom: "",
  day: "Sunday",
  startTime: "",
  endTime: "",
};

export default function Routine() {
  const { currentUser } = useAuth();
  const studentId = currentUser?.studentId;

  const [routines, setRoutines] = useState(() => getRoutines(studentId));
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [toast, setToast] = useState("");
  const [formError, setFormError] = useState("");

  function persist(next) {
    setRoutines(next);
    saveRoutines(studentId, next);
  }

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setFormError("");
    setIsFormOpen(true);
  }

  function openEdit(entry) {
    setForm({
      courseName: entry.courseName,
      teacherName: entry.teacherName,
      classroom: entry.classroom,
      day: entry.day,
      startTime: entry.startTime,
      endTime: entry.endTime,
    });
    setEditingId(entry.id);
    setFormError("");
    setIsFormOpen(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.courseName.trim() || !form.startTime || !form.endTime) {
      setFormError("Course name, start time, and end time are required.");
      return;
    }
    if (form.endTime <= form.startTime) {
      setFormError("End time must be after start time.");
      return;
    }

    if (editingId) {
      persist(routines.map((r) => (r.id === editingId ? { ...r, ...form } : r)));
      setToast("Routine entry updated.");
    } else {
      const newEntry = { id: crypto.randomUUID(), ...form };
      persist([...routines, newEntry]);
      setToast("Routine entry added.");
    }
    setIsFormOpen(false);
  }

  function confirmDelete() {
    persist(routines.filter((r) => r.id !== entryToDelete));
    setEntryToDelete(null);
    setToast("Routine entry deleted.");
  }

  return (
    <div className="page-with-navbar">
      <Navbar />

      <main className="routine-content">
        <div className="academic-toolbar">
          <h2 className="routine-heading">Weekly Timetable</h2>
          <button className="academic-add-btn" onClick={openAdd}>
            + Add Routine
          </button>
        </div>

        {routines.length === 0 ? (
          <div className="empty-state academic-empty">
            <p>Your routine is empty.</p>
            <span>Add your first class to build your weekly timetable.</span>
          </div>
        ) : (
          <RoutineTable routines={routines} onEdit={openEdit} onDelete={setEntryToDelete} />
        )}
      </main>

      {isFormOpen && (
        <div className="overlay-backdrop" onClick={() => setIsFormOpen(false)}>
          <form
            className="overlay-panel glass-panel academic-form"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h3>{editingId ? "Edit Routine Entry" : "Add Routine Entry"}</h3>

            {formError && <div className="auth-alert auth-alert-error">{formError}</div>}

            <label className="auth-field">
              <span>Course Name</span>
              <input
                value={form.courseName}
                onChange={(e) => setForm((f) => ({ ...f, courseName: e.target.value }))}
                autoFocus
              />
            </label>
            <label className="auth-field">
              <span>Teacher Name</span>
              <input
                value={form.teacherName}
                onChange={(e) => setForm((f) => ({ ...f, teacherName: e.target.value }))}
              />
            </label>
            <label className="auth-field">
              <span>Classroom</span>
              <input
                value={form.classroom}
                onChange={(e) => setForm((f) => ({ ...f, classroom: e.target.value }))}
              />
            </label>
            <label className="auth-field">
              <span>Day</span>
              <select
                value={form.day}
                onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
              >
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </label>
            <label className="auth-field">
              <span>Start Time</span>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
              />
            </label>
            <label className="auth-field">
              <span>End Time</span>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
              />
            </label>

            <div className="overlay-actions">
              <button
                type="button"
                className="overlay-btn overlay-btn-ghost"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="overlay-btn overlay-btn-primary">
                Save Entry
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(entryToDelete)}
        title="Delete this routine entry?"
        message="This can't be undone."
        onConfirm={confirmDelete}
        onCancel={() => setEntryToDelete(null)}
      />

      <Toast message={toast} onDismiss={() => setToast("")} />
    </div>
  );
}
