// src/components/StudentCard.jsx
// Displays the logged-in student's identity summary. Pure presentational
// component — takes a student object as a prop, no data fetching of its own.

import "../styles/dashboard.css";

export default function StudentCard({ student }) {
  if (!student) return null;

  const initials = student.fullName
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="student-card glass-panel">
      <div className="student-card-avatar">
        {student.profilePicture ? (
          <img src={student.profilePicture} alt={student.fullName} />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      <div className="student-card-info">
        <h3>{student.fullName}</h3>
        <p className="student-card-id">{student.studentId}</p>
        <div className="student-card-meta">
          <span>{student.department}</span>
          <span>Semester {student.semester}</span>
          <span>Section {student.section}</span>
        </div>
        <p className="student-card-email">{student.email}</p>
      </div>
    </div>
  );
}
