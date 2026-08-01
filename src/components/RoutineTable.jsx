// src/components/RoutineTable.jsx
// Weekly timetable grid: one column per day, entries stacked and sorted by
// start time within each column. Purely presentational — Routine.jsx owns
// the data and passes edit/delete callbacks down.

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function RoutineTable({ routines, onEdit, onDelete }) {
  const byDay = DAYS.map((day) => ({
    day,
    entries: routines
      .filter((r) => r.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }));

  return (
    <div className="routine-table">
      {byDay.map(({ day, entries }) => (
        <div key={day} className="routine-day-column glass-panel">
          <h4>{day}</h4>
          {entries.length === 0 ? (
            <p className="routine-day-empty">No classes</p>
          ) : (
            <div className="routine-entries">
              {entries.map((entry) => (
                <div key={entry.id} className="routine-entry">
                  <div className="routine-entry-time">
                    {entry.startTime} – {entry.endTime}
                  </div>
                  <div className="routine-entry-course">{entry.courseName}</div>
                  <div className="routine-entry-meta">
                    {entry.teacherName} · {entry.classroom}
                  </div>
                  <div className="routine-entry-actions">
                    <button onClick={() => onEdit(entry)}>Edit</button>
                    <button onClick={() => onDelete(entry.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
