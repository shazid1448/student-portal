// src/utils/localStorage.js
// Plain (non-React) helper functions for reading and writing Local Storage.
// No React here on purpose — hooks/useLocalStorage.js wraps a single key/value
// pair for components; this file owns the "students" and "auth" data shape
// and the cross-record logic (duplicate checks, updates) a single hook can't do.

const STUDENTS_KEY = "students";
const AUTH_KEY = "authUser";

/** Safely parse JSON from Local Storage, falling back to a default value. */
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Failed to read "${key}" from Local Storage:`, error);
    return fallback;
  }
}

/** Safely write a value to Local Storage as JSON. */
function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to write "${key}" to Local Storage:`, error);
    return false;
  }
}

/* ---------------------- Students (registered users) ---------------------- */

export function getStudents() {
  return readJSON(STUDENTS_KEY, []);
}

export function saveStudents(students) {
  return writeJSON(STUDENTS_KEY, students);
}

export function addStudent(student) {
  const students = getStudents();
  students.push(student);
  return writeJSON(STUDENTS_KEY, students);
}

export function updateStudent(studentId, updates) {
  const students = getStudents();
  const index = students.findIndex((s) => s.studentId === studentId);
  if (index === -1) return false;
  students[index] = { ...students[index], ...updates };
  return writeJSON(STUDENTS_KEY, students);
}

export function findStudentByEmail(email) {
  return getStudents().find(
    (s) => s.email.toLowerCase() === email.toLowerCase()
  );
}

export function findStudentById(studentId) {
  return getStudents().find((s) => s.studentId === studentId);
}

export function isDuplicateEmail(email) {
  return Boolean(findStudentByEmail(email));
}

export function isDuplicateStudentId(studentId) {
  return Boolean(findStudentById(studentId));
}

/* ------------------------------ Auth status ------------------------------ */

export function getAuthUser() {
  return readJSON(AUTH_KEY, null);
}

export function setAuthUser(email) {
  return writeJSON(AUTH_KEY, { email, loggedInAt: new Date().toISOString() });
}

export function clearAuthUser() {
  localStorage.removeItem(AUTH_KEY);
}

/* ------------------------- Custom Teachers (per student) ------------------ */
// Teachers the student adds themselves, kept separate from the static
// sample directory in data/teachers.js so the two can be merged for display
// without students being able to edit the seeded reference data.

function customTeachersKey(studentId) {
  return `customTeachers_${studentId}`;
}

export function getCustomTeachers(studentId) {
  return readJSON(customTeachersKey(studentId), []);
}

export function saveCustomTeachers(studentId, teachers) {
  return writeJSON(customTeachersKey(studentId), teachers);
}

/* -------------------------- Routines (per student) ------------------------ */
// Keyed by studentId so each student's timetable is separate.

function routinesKey(studentId) {
  return `routines_${studentId}`;
}

export function getRoutines(studentId) {
  return readJSON(routinesKey(studentId), []);
}

export function saveRoutines(studentId, routines) {
  return writeJSON(routinesKey(studentId), routines);
}

/* --------------------------- Notes (per student) --------------------------- */

function notesKey(studentId) {
  return `notes_${studentId}`;
}

export function getNotes(studentId) {
  return readJSON(notesKey(studentId), []);
}

export function saveNotes(studentId, notes) {
  return writeJSON(notesKey(studentId), notes);
}

/* --------------------------- Tasks (per student) ---------------------------- */

function tasksKey(studentId) {
  return `tasks_${studentId}`;
}

export function getTasks(studentId) {
  return readJSON(tasksKey(studentId), []);
}

export function saveTasks(studentId, tasks) {
  return writeJSON(tasksKey(studentId), tasks);
}

/* -------------------------------- Reset ----------------------------------- */

export function clearAllData() {
  localStorage.clear();
}

export { readJSON, writeJSON };
