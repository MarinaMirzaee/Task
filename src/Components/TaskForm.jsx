import { useState } from "react";
import {
  ERRORS,
  PRIORITIES,
  DEFAULT_PRIORITY,
  MAX_TITLE_LENGTH,
} from "../Constants";

export default function TaskForm({ onAdd }) {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState(DEFAULT_PRIORITY);
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const result = onAdd({ title: input, priority, dueDate });
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setInput("");
    setPriority(DEFAULT_PRIORITY);
    setDueDate("");
    setError("");
  }

  return (
    <>
      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          value={input}
          required
          maxLength={MAX_TITLE_LENGTH}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError("");
          }}
          placeholder="What needs to be done?"
          aria-label="Task title"
          aria-invalid={
            error === ERRORS.TITLE_REQUIRED || error === ERRORS.TITLE_TOO_LONG
          }
        />
        <select
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value);
            if (error) setError("");
          }}
          required
          aria-invalid={error === ERRORS.PRIORITY_INVALID}
          aria-label="Priority"
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dueDate}
          required
          onChange={(e) => {
            setDueDate(e.target.value);
            if (error) setError("");
          }}
          aria-label="Due date"
          aria-invalid={
            error === ERRORS.DATE_REQUIRED || error === ERRORS.DATE_INVALID
          }
        />
        <button type="submit">Add Task</button>
      </form>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
