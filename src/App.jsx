import { useState } from "react";
import TaskList from "./Components/TaskList";
import TaskForm from "./Components/TaskForm";
import useTasks from "./hooks/useTasks";
import {
  PRIORITIES,
  FILTERS,
  PRIORITY_FILTERS,
  SORT_OPTIONS,
} from "./Constants";
import "./App.css";

function App() {
  const {
    tasks,
    lastDeleted,
    addTask,
    saveTask,
    toggleTask,
    deleteTask,
    undoDelete,
  } = useTasks();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [editingId, setEditingId] = useState(null);

  function handleSave(id, data) {
    const result = saveTask(id, data);
    if (result.ok) setEditingId(null);
    return result;
  }

  function handleDelete(id) {
    deleteTask(id);
    if (editingId === id) setEditingId(null);
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
          {PRIORITY_FILTERS.map((priority) => (
            <option key={priority} value={priority}>
              {priority === "All" ? "All priorities" : priority}
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
              {option}
            </option>
          ))}
        </select>
      </div>

      {lastDeleted && (
        <div className="undo-bar" role="status">
          <span>Task deleted.</span>
          <button type="button" onClick={undoDelete}>
            Undo
          </button>
        </div>
      )}

      {sortedTasks.length > 0 ? (
        <TaskList
          tasks={sortedTasks}
          priorities={PRIORITIES}
          editingId={editingId}
          onToggle={toggleTask}
          onDelete={handleDelete}
          onStartEdit={setEditingId}
          onSave={handleSave}
          onCancel={() => setEditingId(null)}
        />
      ) : (
        <p className="empty-state">
          {total === 0 ? "No tasks yet. Add one above." : "No matching tasks."}
        </p>
      )}

      <p className="task-count">
        {total} {total === 1 ? "task" : "tasks"} · {activeCount} active ·{" "}
        {completedCount} completed
      </p>
    </main>
  );
}

export default App;
