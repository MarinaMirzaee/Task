export function todayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isValidDate(value) {
  if (value === "") return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  return date.toISOString().slice(0, 10) === value;
}

export function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  return task.dueDate < todayString();
}
