import { useState } from "react";
import TaskItem from "./Components/TaskItem";
import TaskForm from "./Components/TaskForm";
import { isValidDate } from "./utils/dates";
import useLocalStorage from "./hooks/useLocalStorage";
import "./App.css";

const STORAGE_KEY = "task-list-v1";
const PRIORITIES = ["Low", "Medium", "High"];
const FILTERS = ["All", "Active", "Completed"];
const PRIORITY_FILTERS = ["All", ...PRIORITIES];
const SORT_OPTIONS = ["Newest", "Oldest", "Due Date"];

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
    title: "Practice JavaScript",
    completed: false,
    priority: "Medium",
    dueDate: "",
    createdAt: 2,
  },
  {
    id: "initial-3",
    title: "Build a Project",
    completed: false,
    priority: "High",
    dueDate: "",
    createdAt: 3,
  },
];

function createId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function sanitizeTasks(parsed, fallback) {
  if (!Array.isArray(parsed)) return fallback;

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
}

function App() {
  const [tasks, setTasks] = useLocalStorage(
    STORAGE_KEY,
    initialTasks,
    sanitizeTasks,
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [editingId, setEditingId] = useState(null);

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
    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;
    return matchesSearch && matchesFilter && matchesPriority;
  });

  const sortedTasks = [...visibleTasks].sort((a, b) => {
    if (sortBy === "Newest") return b.createdAt - a.createdAt;
    if (sortBy === "Oldest") return a.createdAt - b.createdAt;

    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
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

        <select
          aria-label="Filter by priority"
          value={priorityFilter}
          onChange={(event) => {
            setPriorityFilter(event.target.value);
            setEditingId(null);
          }}
        >
          {PRIORITY_FILTERS.map((p) => (
            <option key={p} value={p}>
              {p === "All" ? "All priorities" : p}
            </option>
          ))}
        </select>

        <select
          aria-label="Sort tasks"
          value={sortBy}
          onChange={(event) => {
            setSortBy(event.target.value);
            setEditingId(null);
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              Sort: {option}
            </option>
          ))}
        </select>
      </div>

      {total === 0 ? (
        <p className="empty-state">No tasks yet. Add one above.</p>
      ) : visibleTasks.length === 0 ? (
        <p className="empty-state">No matching tasks.</p>
      ) : (
        <ul className="task-list">
          {sortedTasks.map((task) => (
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
