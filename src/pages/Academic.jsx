// src/pages/Academic.jsx
// Page 3: Notes + To-Do List, tabbed (the spec describes two sections but
// doesn't dictate layout — tabs keep it usable on mobile instead of two long
// stacked lists). Both datasets persist per-student in Local Storage via
// utils/localStorage.js, so they show up on the Dashboard's stat cards too.

import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { getNotes, saveNotes, getTasks, saveTasks } from "../utils/localStorage";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import TodoCard from "../components/TodoCard";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import "../styles/academic.css";

const emptyNoteForm = { title: "", content: "" };
const emptyTaskForm = { title: "", dueDate: "" };

export default function Academic() {
  const { currentUser } = useAuth();
  const studentId = currentUser?.studentId;

  const [activeTab, setActiveTab] = useState("notes");
  const [toast, setToast] = useState("");

  /* ------------------------------- Notes state ------------------------------ */
  const [notes, setNotes] = useState(() => getNotes(studentId));
  const [noteSearch, setNoteSearch] = useState("");
  const [noteForm, setNoteForm] = useState(emptyNoteForm);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  function persistNotes(nextNotes) {
    setNotes(nextNotes);
    saveNotes(studentId, nextNotes);
  }

  function openAddNote() {
    setNoteForm(emptyNoteForm);
    setEditingNoteId(null);
    setIsNoteFormOpen(true);
  }

  function openEditNote(note) {
    setNoteForm({ title: note.title, content: note.content });
    setEditingNoteId(note.id);
    setIsNoteFormOpen(true);
  }

  function handleNoteFormSubmit(event) {
    event.preventDefault();
    if (!noteForm.title.trim()) return;

    if (editingNoteId) {
      const updated = notes.map((n) =>
        n.id === editingNoteId
          ? { ...n, ...noteForm, updatedAt: new Date().toISOString() }
          : n
      );
      persistNotes(updated);
      setToast("Note updated.");
    } else {
      const newNote = {
        id: crypto.randomUUID(),
        ...noteForm,
        pinned: false,
        updatedAt: new Date().toISOString(),
      };
      persistNotes([newNote, ...notes]);
      setToast("Note added.");
    }
    setIsNoteFormOpen(false);
  }

  function togglePin(id) {
    persistNotes(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  }

  function confirmDeleteNote() {
    persistNotes(notes.filter((n) => n.id !== noteToDelete));
    setNoteToDelete(null);
    setToast("Note deleted.");
  }

  const visibleNotes = useMemo(() => {
    const filtered = notes.filter(
      (n) =>
        n.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
        n.content.toLowerCase().includes(noteSearch.toLowerCase())
    );
    return [...filtered].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [notes, noteSearch]);

  /* ------------------------------- Tasks state ------------------------------ */
  const [tasks, setTasks] = useState(() => getTasks(studentId));
  const [taskFilter, setTaskFilter] = useState("all"); // all | pending | completed
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  function persistTasks(nextTasks) {
    setTasks(nextTasks);
    saveTasks(studentId, nextTasks);
  }

  function openAddTask() {
    setTaskForm(emptyTaskForm);
    setEditingTaskId(null);
    setIsTaskFormOpen(true);
  }

  function openEditTask(task) {
    setTaskForm({ title: task.title, dueDate: task.dueDate || "" });
    setEditingTaskId(task.id);
    setIsTaskFormOpen(true);
  }

  function handleTaskFormSubmit(event) {
    event.preventDefault();
    if (!taskForm.title.trim()) return;

    if (editingTaskId) {
      const updated = tasks.map((t) =>
        t.id === editingTaskId ? { ...t, ...taskForm } : t
      );
      persistTasks(updated);
      setToast("Task updated.");
    } else {
      const newTask = {
        id: crypto.randomUUID(),
        ...taskForm,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      persistTasks([newTask, ...tasks]);
      setToast("Task added.");
    }
    setIsTaskFormOpen(false);
  }

  function toggleComplete(id) {
    persistTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function confirmDeleteTask() {
    persistTasks(tasks.filter((t) => t.id !== taskToDelete));
    setTaskToDelete(null);
    setToast("Task deleted.");
  }

  const visibleTasks = tasks.filter((t) => {
    if (taskFilter === "pending") return !t.completed;
    if (taskFilter === "completed") return t.completed;
    return true;
  });

  return (
    <div className="page-with-navbar">
      <Navbar />

      <main className="academic-content">
        <div className="academic-tabs">
          <button
            className={activeTab === "notes" ? "academic-tab-active" : ""}
            onClick={() => setActiveTab("notes")}
          >
            Notes
          </button>
          <button
            className={activeTab === "tasks" ? "academic-tab-active" : ""}
            onClick={() => setActiveTab("tasks")}
          >
            To-Do List
          </button>
        </div>

        {activeTab === "notes" && (
          <section>
            <div className="academic-toolbar">
              <input
                className="academic-search"
                type="text"
                placeholder="Search notes..."
                value={noteSearch}
                onChange={(e) => setNoteSearch(e.target.value)}
              />
              <button className="academic-add-btn" onClick={openAddNote}>
                + Add Note
              </button>
            </div>

            {visibleNotes.length === 0 ? (
              <div className="empty-state academic-empty">
                <p>No notes yet.</p>
                <span>Add your first note to get started.</span>
              </div>
            ) : (
              <div className="note-grid">
                {visibleNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={openEditNote}
                    onDelete={setNoteToDelete}
                    onTogglePin={togglePin}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "tasks" && (
          <section>
            <div className="academic-toolbar">
              <div className="academic-filter-group">
                {["all", "pending", "completed"].map((f) => (
                  <button
                    key={f}
                    className={taskFilter === f ? "academic-filter-active" : ""}
                    onClick={() => setTaskFilter(f)}
                  >
                    {f[0].toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <button className="academic-add-btn" onClick={openAddTask}>
                + Add Task
              </button>
            </div>

            {visibleTasks.length === 0 ? (
              <div className="empty-state academic-empty">
                <p>No tasks here.</p>
                <span>Add a task or switch filters.</span>
              </div>
            ) : (
              <div className="todo-list">
                {visibleTasks.map((task) => (
                  <TodoCard
                    key={task.id}
                    task={task}
                    onEdit={openEditTask}
                    onDelete={setTaskToDelete}
                    onToggleComplete={toggleComplete}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* ---------- Note form panel ---------- */}
      {isNoteFormOpen && (
        <div className="overlay-backdrop" onClick={() => setIsNoteFormOpen(false)}>
          <form
            className="overlay-panel glass-panel academic-form"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleNoteFormSubmit}
          >
            <h3>{editingNoteId ? "Edit Note" : "Add Note"}</h3>
            <label className="auth-field">
              <span>Title</span>
              <input
                value={noteForm.title}
                onChange={(e) => setNoteForm((f) => ({ ...f, title: e.target.value }))}
                autoFocus
              />
            </label>
            <label className="auth-field">
              <span>Content</span>
              <textarea
                rows={5}
                value={noteForm.content}
                onChange={(e) => setNoteForm((f) => ({ ...f, content: e.target.value }))}
              />
            </label>
            <div className="overlay-actions">
              <button
                type="button"
                className="overlay-btn overlay-btn-ghost"
                onClick={() => setIsNoteFormOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="overlay-btn overlay-btn-primary">
                Save Note
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---------- Task form panel ---------- */}
      {isTaskFormOpen && (
        <div className="overlay-backdrop" onClick={() => setIsTaskFormOpen(false)}>
          <form
            className="overlay-panel glass-panel academic-form"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleTaskFormSubmit}
          >
            <h3>{editingTaskId ? "Edit Task" : "Add Task"}</h3>
            <label className="auth-field">
              <span>Task</span>
              <input
                value={taskForm.title}
                onChange={(e) => setTaskForm((f) => ({ ...f, title: e.target.value }))}
                autoFocus
              />
            </label>
            <label className="auth-field">
              <span>Due Date</span>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm((f) => ({ ...f, dueDate: e.target.value }))}
              />
            </label>
            <div className="overlay-actions">
              <button
                type="button"
                className="overlay-btn overlay-btn-ghost"
                onClick={() => setIsTaskFormOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="overlay-btn overlay-btn-primary">
                Save Task
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(noteToDelete)}
        title="Delete this note?"
        message="This can't be undone."
        onConfirm={confirmDeleteNote}
        onCancel={() => setNoteToDelete(null)}
      />
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        title="Delete this task?"
        message="This can't be undone."
        onConfirm={confirmDeleteTask}
        onCancel={() => setTaskToDelete(null)}
      />

      <Toast message={toast} onDismiss={() => setToast("")} />
    </div>
  );
}
