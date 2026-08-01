// src/pages/Dashboard.jsx
// Landing page after login. Pulls the student's notes/tasks/routines from
// Local Storage (empty arrays until Academic/Routine pages are built —
// everything here reads the same keys those pages write to, so it fills in
// automatically) and combines them with the static teachers/notices data.

import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { getNotes, getTasks, getRoutines } from "../utils/localStorage";
import Navbar from "../components/Navbar";
import StudentCard from "../components/StudentCard";
import Countdown from "../components/Countdown";
import LiveClock from "../components/LiveClock";
import "../styles/dashboard.css";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Dashboard() {
  const { currentUser } = useAuth();

  const notes = useMemo(() => getNotes(currentUser?.studentId), [currentUser]);
  const tasks = useMemo(() => getTasks(currentUser?.studentId), [currentUser]);
  const routines = useMemo(() => getRoutines(currentUser?.studentId), [currentUser]);

  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalCourses = new Set(routines.map((r) => r.courseName)).size;

  const todayName = DAY_NAMES[new Date().getDay()];
  const todaysRoutine = routines
    .filter((r) => r.day === todayName)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="page-with-navbar">
      <Navbar />

      <main className="dashboard-content">
        <section className="dashboard-top">
          <StudentCard student={currentUser} />
          <Countdown routines={routines} />
        </section>

        <section className="dashboard-stats">
          <div className="stat-card glass-panel">
            <span className="stat-value">{notes.length}</span>
            <span className="stat-label">Total Notes</span>
          </div>
          <div className="stat-card glass-panel">
            <span className="stat-value">{pendingTasks}</span>
            <span className="stat-label">Pending Tasks</span>
          </div>
          <div className="stat-card glass-panel">
            <span className="stat-value">{completedTasks}</span>
            <span className="stat-label">Completed Tasks</span>
          </div>
          <div className="stat-card glass-panel">
            <span className="stat-value">{totalCourses}</span>
            <span className="stat-label">Total Courses</span>
          </div>
        </section>

        <section className="dashboard-columns">
          <div className="dashboard-card glass-panel">
            <h3>Today's Routine</h3>
            {todaysRoutine.length === 0 ? (
              <div className="empty-state">
                <p>Nothing scheduled today.</p>
                <span>Build your timetable in Routine Builder.</span>
              </div>
            ) : (
              <ul className="today-routine-list">
                {todaysRoutine.map((entry) => (
                  <li key={entry.id}>
                    <span className="today-routine-time">{entry.startTime}</span>
                    <span className="today-routine-course">{entry.courseName}</span>
                    <span className="today-routine-room">{entry.classroom}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <LiveClock />
        </section>
      </main>
    </div>
  );
}
