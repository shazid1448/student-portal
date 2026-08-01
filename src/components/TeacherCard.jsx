// src/components/TeacherCard.jsx
// One teacher's display card. Sample teachers (data/teachers.js) are
// browse-only; teachers the student added themselves get edit/delete
// buttons, controlled by the isCustom flag Teachers.jsx passes in.

export default function TeacherCard({ teacher, isCustom, onEdit, onDelete }) {
  const initials = teacher.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="teacher-card glass-panel">
      {isCustom && <span className="teacher-card-custom-badge">Added by you</span>}

      <div className="teacher-card-avatar">
        {teacher.photo ? <img src={teacher.photo} alt={teacher.name} /> : <span>{initials}</span>}
      </div>
      <h4>{teacher.name}</h4>
      <p className="teacher-card-designation">{teacher.designation}</p>
      <span className="teacher-card-dept">{teacher.department}</span>

      <div className="teacher-card-details">
        <p>
          <strong>Course:</strong> {teacher.course}
        </p>
        <p>
          <strong>Email:</strong> {teacher.email}
        </p>
        <p>
          <strong>Phone:</strong> {teacher.phone}
        </p>
        <p>
          <strong>Room:</strong> {teacher.room}
        </p>
      </div>

      {isCustom && (
        <div className="teacher-card-actions">
          <button onClick={() => onEdit(teacher)}>Edit</button>
          <button onClick={() => onDelete(teacher.id)}>Delete</button>
        </div>
      )}
    </div>
  );
}
