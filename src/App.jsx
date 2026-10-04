import { useState } from 'react'
import TaskItem from './Components/TaskItem'
import './App.css'

const initialTasks = [
  { id: 1, title: 'Learn React', completed: false },
  { id: 2, title: 'Practice JavaScript', completed: false },
  { id: 3, title: 'Build a Project', completed: false },
]

function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const [input, setInput] = useState('')

  function addTask(event) {
    event.preventDefault()
    const title = input.trim()

    if (!title) return

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: crypto.randomUUID(), title, completed: false },
    ])
    setInput('')
  }

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const remainingTasks = tasks.filter((task) => !task.completed).length

  return (
    <main className="task-app">
      <h1>My Task List</h1>

      <form className="task-form" onSubmit={addTask}>
        <label className="visually-hidden" htmlFor="new-task">
          New task
        </label>
        <input
          id="new-task"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add Task</button>
      </form>

      {tasks.length > 0 ? (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={toggleTask} />
          ))}
        </ul>
      ) : (
        <p className="empty-state">No tasks yet. Add one above.</p>
      )}

      <p className="task-count" aria-live="polite">
        {remainingTasks} {remainingTasks === 1 ? 'task' : 'tasks'} remaining
      </p>
    </main>
  )
}

export default App
