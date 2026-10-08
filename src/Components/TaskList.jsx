import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  priorities,
  editingId,
  onToggle,
  onDelete,
  onStartEdit,
  onSave,
  onCancel,
}) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          priorities={priorities}
          isEditing={editingId === task.id}
          editLocked={editingId !== null && editingId !== task.id}
          onToggle={onToggle}
          onDelete={onDelete}
          onStartEdit={onStartEdit}
          onSave={onSave}
          onCancel={onCancel}
        />
      ))}
    </ul>
  );
}
