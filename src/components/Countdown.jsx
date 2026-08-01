// src/components/Countdown.jsx
// Renders the live countdown to the next upcoming class (from useCountdown).
// Shows an empty state if the student has no routine entries yet.

import useCountdown from "../hooks/useCountdown";
import "../styles/dashboard.css";

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function Countdown({ routines }) {
  const { hasUpcoming, entry, parts } = useCountdown(routines);

  if (!hasUpcoming) {
    return (
      <div className="dashboard-card glass-panel countdown-card">
        <h3>Upcoming</h3>
        <div className="empty-state">
          <p>No upcoming classes yet.</p>
          <span>Add entries in Routine Builder to see a live countdown here.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card glass-panel countdown-card">
      <h3>Upcoming</h3>
      <p className="countdown-course">{entry.courseName}</p>
      <p className="countdown-meta">
        {entry.day} · {entry.startTime} · {entry.classroom}
      </p>
      <div className="countdown-timer">
        <div>
          <span>{pad(parts.days)}</span>
          <small>days</small>
        </div>
        <div>
          <span>{pad(parts.hours)}</span>
          <small>hrs</small>
        </div>
        <div>
          <span>{pad(parts.minutes)}</span>
          <small>min</small>
        </div>
        <div>
          <span>{pad(parts.seconds)}</span>
          <small>sec</small>
        </div>
      </div>
    </div>
  );
}
