// src/components/TodoCard.jsx
// One task's display row: completed checkbox, due date, edit, delete.
// Purely presentational — Academic.jsx owns the task data.

function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export default function TodoCard({ task, onEdit, onDelete, onToggleComplete }) {
  const overdue = isOverdue(task.dueDate, task.completed);

  return (
    <div className={`todo-card glass-panel ${task.completed ? "todo-card-done" : ""}`}>
      <label className="todo-checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
        />
        <span className="todo-checkmark" />
      </label>

      <div className="todo-card-body">
        <p className="todo-card-title">{task.title}</p>
        {task.dueDate && (
          <span className={`todo-card-due ${overdue ? "todo-card-due-overdue" : ""}`}>
            Due {new Date(task.dueDate).toLocaleDateString()}
            {overdue ? " · overdue" : ""}
          </span>
        )}
      </div>

      <div className="todo-card-actions">
        <button onClick={() => onEdit(task)}>Edit</button>
        <button onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  );
}