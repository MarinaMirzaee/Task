import { useState } from "react";
import { isValidDate } from "../utils/dates";

const PRIORITIES = ["Low", "Medium", "High"];

export default function TaskForm({ onAdd }) {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const title = input.trim();

    if (!title) {
      setError("Task title cannot be empty.");
      return;
    }

    if (!isValidDate(dueDate)) {
      setError("Invalid date. Please choose a real date.");
      return;
    }

    onAdd({ title, priority, dueDate });
    setInput("");
    setPriority("Medium");
    setDueDate("");
    setError("");
  }

  return (
    <>
      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError("");
          }}
          placeholder="What needs to be done?"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => {
            setDueDate(e.target.value);
            if (error) setError("");
          }}
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
