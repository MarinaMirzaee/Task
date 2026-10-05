import { useEffect, useState } from 'react'
import TaskItem from './Components/TaskItem'
import './App.css'

const STORAGE_KEY = 'task-list-v1'
const PRIORITIES = ['Low', 'Medium', 'High']
const FILTERS = ['All', 'Active', 'Completed']

const initialTasks = [
  { id: 'initial-1', title: 'Learn React', completed: false, priority: 'Medium' },
  { id: 'initial-2', title: 'Practice JavaScript', completed: false, priority: 'Medium' },
  { id: 'initial-3', title: 'Build a Project', completed: false, priority: 'High' },
]

function createId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

// Reads saved tasks. Anything invalid is dropped; a broken save never crashes the app.
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return initialTasks

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return initialTasks

    return parsed
      .filter(
        (task) =>
          task &&
          (typeof task.id === 'string' || typeof task.id === 'number') &&
          typeof task.title === 'string' &&
          task.title.trim() !== '' &&
          typeof task.completed === 'boolean',
      )
      .map((task) => ({
        id: task.id,
        title: task.title.trim(),
        completed: task.completed,
        priority: PRIORITIES.includes(task.priority) ? task.priority : 'Medium',
      }))
  } catch {
    return initialTasks
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [input, setInput] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // Storage may be full or blocked; the app keeps working in memory.
    }
  }, [tasks])

  function addTask(event) {
    event.preventDefault()
    const title = input.trim()

    if (!title) {
      setError('Task title cannot be empty.')
      return
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: createId(), title, completed: false, priority },
    ])
    setInput('')
    setPriority('Medium')
    setError('')
  }

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function deleteTask(id) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
    if (editingId === id) setEditingId(null)
  }

  function saveTask(id, title, newPriority) {
    const trimmed = title.trim()
    if (!trimmed) return false // TaskItem shows the error and stays in edit mode

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, title: trimmed, priority: newPriority } : task,
      ),
    )
    setEditingId(null)
    return true
  }

  function changeSearch(value) {
    setSearch(value)
    setEditingId(null)
  }

  function changeFilter(value) {
    setFilter(value)
    setEditingId(null)
  }

  // Everything below is derived from `tasks`; no duplicate copies in state.
  const total = tasks.length
  const completedCount = tasks.filter((task) => task.completed).length
  const activeCount = total - completedCount

  const query = search.trim().toLowerCase()
  const visibleTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(query)
    const matchesFilter =
      filter === 'All' ||
      (filter === 'Active' && !task.completed) ||
      (filter === 'Completed' && task.completed)
    return matchesSearch && matchesFilter
  })

  return (
    <main className="task-app">
      <h1>My Task Manager</h1>

      <form className="task-form" onSubmit={addTask} noValidate>
        <label className="visually-hidden" htmlFor="new-task">
          New task
        </label>
        <input
          id="new-task"
          type="text"
          value={input}
          onChange={(event) => {
            setInput(event.target.value)
            if (error) setError('')
          }}
          placeholder="What needs to be done?"
          aria-invalid={Boolean(error)}
        />
        <label className="visually-hidden" htmlFor="new-priority">
          Priority
        </label>
        <select
          id="new-priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
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
              className={filter === name ? 'is-active' : ''}
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
  )
}

export default App