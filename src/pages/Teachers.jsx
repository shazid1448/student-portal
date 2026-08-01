// src/pages/Teachers.jsx
// Page 4: teacher directory. data/teachers.js is the static sample list
// (per the original spec, browse-only). Students can also add their own
// teachers, stored per-student in Local Storage via
// utils/localStorage.js (getCustomTeachers/saveCustomTeachers) — those get
// edit/delete, the sample ones don't. Both lists are merged for search/filter.

import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { getCustomTeachers, saveCustomTeachers } from "../utils/localStorage";
import Navbar from "../components/Navbar";
import TeacherCard from "../components/TeacherCard";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import sampleTeachers from "../data/teachers";
import "../styles/teachers.css";

const emptyForm = {
  name: "",
  designation: "",
  department: "",
  course: "",
  email: "",
  phone: "",
  room: "",
};

export default function Teachers() {
  const { currentUser } = useAuth();
  const studentId = currentUser?.studentId;

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [toast, setToast] = useState("");

  const [customTeachers, setCustomTeachers] = useState(() => getCustomTeachers(studentId));
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  function persist(next) {
    setCustomTeachers(next);
    saveCustomTeachers(studentId, next);
  }

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setIsFormOpen(true);
  }

  function openEdit(teacher) {
    setForm({
      name: teacher.name,
      designation: teacher.designation,
      department: teacher.department,
      course: teacher.course,
      email: teacher.email,
      phone: teacher.phone,
      room: teacher.room,
    });
    setEditingId(teacher.id);
    setIsFormOpen(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.department.trim()) return;

    if (editingId) {
      persist(customTeachers.map((t) => (t.id === editingId ? { ...t, ...form } : t)));
      setToast("Teacher updated.");
    } else {
      const newTeacher = { id: crypto.randomUUID(), ...form, photo: null };
      persist([newTeacher, ...customTeachers]);
      setToast("Teacher added.");
    }
    setIsFormOpen(false);
  }

  function confirmDelete() {
    persist(customTeachers.filter((t) => t.id !== teacherToDelete));
    setTeacherToDelete(null);
    setToast("Teacher removed.");
  }

  // Merge sample + custom, tagging each with where it came from.
  const allTeachers = useMemo(
    () => [
      ...customTeachers.map((t) => ({ ...t, isCustom: true })),
      ...sampleTeachers.map((t) => ({ ...t, isCustom: false })),
    ],
    [customTeachers]
  );

  const departments = useMemo(
    () => ["All", ...new Set(allTeachers.map((t) => t.department).filter(Boolean))],
    [allTeachers]
  );

  const visibleTeachers = useMemo(() => {
    return allTeachers.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.course.toLowerCase().includes(search.toLowerCase());
      const matchesDept = department === "All" || t.department === department;
      return matchesSearch && matchesDept;
    });
  }, [allTeachers, search, department]);

  return (
    <div className="page-with-navbar">
      <Navbar />

      <main className="teachers-content">
        <div className="academic-toolbar">
          <input
            className="academic-search"
            type="text"
            placeholder="Search by name or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="teachers-dept-select"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <button className="academic-add-btn" onClick={openAdd}>
            + Add Teacher
          </button>
        </div>

        {visibleTeachers.length === 0 ? (
          <div className="empty-state academic-empty">
            <p>No teachers match your search.</p>
            <span>Try a different name, course, or department.</span>
          </div>
        ) : (
          <div className="teacher-grid">
            {visibleTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                isCustom={teacher.isCustom}
                onEdit={openEdit}
                onDelete={setTeacherToDelete}
              />
            ))}
          </div>
        )}
      </main>

      {isFormOpen && (
        <div className="overlay-backdrop" onClick={() => setIsFormOpen(false)}>
          <form
            className="overlay-panel glass-panel academic-form teacher-form"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h3>{editingId ? "Edit Teacher" : "Add Teacher"}</h3>

            <div className="auth-grid">
              <label className="auth-field">
                <span>Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  autoFocus
                />
              </label>
              <label className="auth-field">
                <span>Designation</span>
                <input
                  value={form.designation}
                  onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                />
              </label>
              <label className="auth-field">
                <span>Department</span>
                <input
                  value={form.department}
                  onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                />
              </label>
              <label className="auth-field">
                <span>Course</span>
                <input
                  value={form.course}
                  onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}
                />
              </label>
              <label className="auth-field">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </label>
              <label className="auth-field">
                <span>Phone Number</span>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </label>
              <label className="auth-field auth-field-span2">
                <span>Office Room</span>
                <input
                  value={form.room}
                  onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))}
                />
              </label>
            </div>

            <div className="overlay-actions">
              <button
                type="button"
                className="overlay-btn overlay-btn-ghost"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="overlay-btn overlay-btn-primary">
                Save Teacher
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(teacherToDelete)}
        title="Remove this teacher?"
        message="This can't be undone."
        onConfirm={confirmDelete}
        onCancel={() => setTeacherToDelete(null)}
      />

      <Toast message={toast} onDismiss={() => setToast("")} />
    </div>
  );
}