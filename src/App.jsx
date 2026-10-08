import { useEffect, useState } from "react";
import TaskItem from "./Components/TaskItem";
import TaskForm from "./Components/TaskForm";
import { isValidDate } from "./utils/dates";
import "./App.css";

const STORAGE_KEY = "task-list-v1";
const PRIORITIES = ["Low", "Medium", "High"];
const FILTERS = ["All", "Active", "Completed"];

const initialTasks = [
  {
    id: "initial-1",
    title: "Learn React",
    completed: false,
    priority: "Medium",
    dueDate: "",
    createdAt: 1,
  },
  {
    id: "initial-2",
    title: "Learn React",
    completed: false,
    priority: "Medium",
    dueDate: "",
    createdAt: 2,
  },
  {
    id: "initial-3",
    title: "Learn React",
    completed: false,
    priority: "Medium",
    dueDate: "",
    createdAt: 3,
  },
];

function createId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return initialTasks;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return initialTasks;

    return parsed
      .filter(
        (task) =>
          task &&
          (typeof task.id === "string" || typeof task.id === "number") &&
          typeof task.title === "string" &&
          task.title.trim() !== "" &&
          typeof task.completed === "boolean",
      )
      .map((task) => ({
        id: task.id,
        title: task.title.trim(),
        completed: task.completed,
        priority: PRIORITIES.includes(task.priority) ? task.priority : "Medium",
        dueDate:
          typeof task.dueDate === "string" && isValidDate(task.dueDate)
            ? task.dueDate
            : "",
        createdAt:
          typeof task.createdAt === "number" ? task.createdAt : Date.now(),
      }));
  } catch {
    return initialTasks;
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Storage may be full or blocked; the app keeps working in memory.
    }
  }, [tasks]);

  function addTask({ title, priority, dueDate }) {
    const newTask = {
      id: createId(),
      title,
      completed: false,
      priority,
      dueDate,
      createdAt: Date.now(),
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
  }

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    if (editingId === id) setEditingId(null);
  }

  function saveTask(id, title, newPriority, newDueDate) {
    const trimmed = title.trim();
    if (!trimmed) return false;
    if (!isValidDate(newDueDate)) return false;

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: trimmed,
              priority: newPriority,
              dueDate: newDueDate,
            }
          : task,
      ),
    );
    setEditingId(null);
    return true;
  }

  function changeSearch(value) {
    setSearch(value);
    setEditingId(null);
  }

  function changeFilter(value) {
    setFilter(value);
    setEditingId(null);
  }

  const total = tasks.length;
  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = total - completedCount;

  const query = search.trim().toLowerCase();
  const visibleTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(query);
    const matchesFilter =
      filter === "All" ||
      (filter === "Active" && !task.completed) ||
      (filter === "Completed" && task.completed);
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="task-app">
      <h1>My Task Manager</h1>

      <TaskForm onAdd={addTask} />

      <div className="task-controls">
        <label className="visually-hidden" htmlFor="search-tasks">
          Search tasks
        </label>
        <input
          id="search-tasks"
          type="search"
          value={search}
          onChange={(event) => changeSearch(event.target.value)}
          placeholder="Search tasks"
        />
        <div className="filter-group" role="group" aria-label="Filter tasks">
          {FILTERS.map((name) => (
            <button
              key={name}
              type="button"
              className={filter === name ? "is-active" : ""}
              aria-pressed={filter === name}
              onClick={() => changeFilter(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {total === 0 ? (
        <p className="empty-state">No tasks yet. Add one above.</p>
      ) : visibleTasks.length === 0 ? (
        <p className="empty-state">No matching tasks.</p>
      ) : (
        <ul className="task-list">
          {visibleTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              priorities={PRIORITIES}
              isEditing={editingId === task.id}
              editLocked={editingId !== null && editingId !== task.id}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onStartEdit={setEditingId}
              onSave={saveTask}
              onCancel={() => setEditingId(null)}
            />
          ))}
        </ul>
      )}

      <p className="task-count" aria-live="polite">
        Total: {total} · Active: {activeCount} · Completed: {completedCount}
      </p>
    </main>
  );
}

export default App;
