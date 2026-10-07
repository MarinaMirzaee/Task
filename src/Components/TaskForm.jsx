import { useState } from "react";

const PRIORITIES = ["Low", "Medium", "High"];

export default function TaskForm({ onAdd }) {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const title = input.trim();

    if (!title) {
      setError("Task title cannot be empty.");
      return;
    }

    onAdd({ title, priority });
    setInput("");
    setPriority("Medium");
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
