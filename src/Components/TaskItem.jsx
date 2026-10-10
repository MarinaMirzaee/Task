import { useState } from "react";
import { ERRORS, MAX_TITLE_LENGTH } from "../Constants";
import { isOverdue } from "../utils/dates";

function EditForm({ task, priorities, onSave, onCancel }) {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const result = onSave(task.id, { title, priority, dueDate });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError("");
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
        maxLength={MAX_TITLE_LENGTH}
        required
        autoFocus
        onChange={(event) => {
          setTitle(event.target.value);
          if (error) setError("");
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") onCancel();
        }}
        aria-invalid={
          error === ERRORS.TITLE_REQUIRED || error === ERRORS.TITLE_TOO_LONG
        }
      />
      <label className="visually-hidden" htmlFor={`edit-priority-${task.id}`}>
        Edit priority
      </label>
      <select
        id={`edit-priority-${task.id}`}
        value={priority}
        required
        onChange={(event) => {
          setPriority(event.target.value);
          if (error) setError("");
        }}
        aria-invalid={error === ERRORS.PRIORITY_INVALID}
      >
        {priorities.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={dueDate}
        required
        onChange={(event) => {
          setDueDate(event.target.value);
          if (error) setError("");
        }}
        aria-invalid={
          error === ERRORS.DATE_REQUIRED || error === ERRORS.DATE_INVALID
        }
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
