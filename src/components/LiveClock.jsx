// src/components/LiveClock.jsx
// Live digital clock + date, replacing the static Notice Board on the
// Dashboard. Ticks every second via useState/useEffect — no external time
// library, matching the "React + CSS only" constraint from the spec.

import { useState, useEffect } from "react";
import { FiClock } from "react-icons/fi";
import "../styles/liveClock.css";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatTime12Hour(date) {
  let hours = date.getHours();
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return { hours: pad(hours), minutes, seconds, period };
}

export default function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const { hours, minutes, seconds, period } = formatTime12Hour(now);
  const weekday = WEEKDAYS[now.getDay()];
  const dateLabel = `${pad(now.getDate())} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <div className="live-clock-card glass-panel">
      <div className="live-clock-glow" aria-hidden="true" />

      <div className="live-clock-icon">
        <FiClock />
      </div>

      <span className="live-clock-weekday">{weekday}</span>

      <div className="live-clock-time" aria-live="off">
        <span>{hours}</span>
        <span className="live-clock-colon">:</span>
        <span>{minutes}</span>
        <span className="live-clock-colon">:</span>
        <span>{seconds}</span>
        <span className="live-clock-period">{period}</span>
      </div>

      <p className="live-clock-date">{weekday}, {dateLabel}</p>
    </div>
  );
}
