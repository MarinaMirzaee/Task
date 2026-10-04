export default function TaskItem({ task, onToggle }) {
  return (
    <li className={`task-item${task.completed ? ' is-completed' : ''}`}>
      <span>{task.title}</span>
      <button
        type="button"
        className="toggle-task"
        onClick={() => onToggle(task.id)}
        aria-pressed={task.completed}
        aria-label={`${task.completed ? 'Mark as incomplete' : 'Mark as complete'}: ${task.title}`}
      >
        {task.completed ? 'Undo' : 'Complete'}
      </button>
    </li>
  )
}