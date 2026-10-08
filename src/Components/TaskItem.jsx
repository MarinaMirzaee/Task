import { useState } from "react";
import { isValidDate, isOverdue } from "../utils/dates";

function EditForm({ task, priorities, onSave, onCancel }) {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }

    if (!isValidDate(dueDate)) {
      setError("Invalid date. Please choose a real date.");
      return;
    }
    onSave(task.id, title, priority, dueDate);
  }

  return (
    <form className="edit-form" onSubmit={handleSubmit} noValidate>
      <label className="visually-hidden" htmlFor={`edit-title-${task.id}`}>
        Edit task title
      </label>
      <input
        id={`edit-title-${task.id}`}
        type="text"
        value={title}
        autoFocus
        onChange={(event) => {
          setTitle(event.target.value);
          if (error) setError("");
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") onCancel();
        }}
        aria-invalid={Boolean(error)}
      />
      <label className="visually-hidden" htmlFor={`edit-priority-${task.id}`}>
        Edit priority
      </label>
      <select
        id={`edit-priority-${task.id}`}
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
      >
        {priorities.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {/* NEW: input date */}

      <input
        type="date"
        value={dueDate}
        onChange={(event) => {
          setDueDate(event.target.value);
          if (error) setError("");
        }}
        aria-label="Edit due date"
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

export default function TaskItem({
  task,
  priorities,
  isEditing,
  editLocked,
  onToggle,
  onDelete,
  onStartEdit,
  onSave,
  onCancel,
}) {
  if (isEditing) {
    return (
      <li className="task-item is-editing">
        <EditForm
          task={task}
          priorities={priorities}
          onSave={onSave}
          onCancel={onCancel}
        />
      </li>
    );
  }

  return (
    <li className={`task-item${task.completed ? " is-completed" : ""}`}>
      <span className="task-title">{task.title}</span>
      <span
        className={`priority-badge priority-${task.priority.toLowerCase()}`}
      >
        {task.priority}
      </span>

      {/* NEW: Date and Overdue */}

      {task.dueDate && <span className="due-date">Due: {task.dueDate}</span>}
      {isOverdue(task) && <span className="overdue">Overdue</span>}
      <button
        type="button"
        className="toggle-task"
        onClick={() => onToggle(task.id)}
        aria-pressed={task.completed}
        aria-label={`${task.completed ? "Mark as incomplete" : "Mark as complete"}: ${task.title}`}
      >
        {task.completed ? "Undo" : "Complete"}
      </button>
      <button
        type="button"
        onClick={() => onStartEdit(task.id)}
        disabled={editLocked}
        aria-label={`Edit: ${task.title}`}
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete: ${task.title}`}
      >
        Delete
      </button>
    </li>
  );
}
