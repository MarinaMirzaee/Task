import { useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage.js";
import { validateTask } from "../utils/validation.js";
import { isValidDate, todayString } from "../utils/dates.js";
import {
  STORAGE_KEY,
  PRIORITIES,
  DEFAULT_PRIORITY,
  UNDO_TIMEOUT_MS,
  initialTasks,
} from "../Constants.js";

function createId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function sanitizeTasks(value, fallback) {
  if (!Array.isArray(value)) return fallback;

  return value
    .filter(
      (task) =>
        task &&
        ((typeof task.id === "string" && task.id.trim() !== "") ||
          (typeof task.id === "number" && Number.isFinite(task.id))) &&
        typeof task.title === "string" &&
        task.title.trim() !== "" &&
        typeof task.completed === "boolean",
    )
    .map((task) => ({
      ...task,
      title: task.title.trim(),
      priority: PRIORITIES.includes(task.priority)
        ? task.priority
        : DEFAULT_PRIORITY,
      dueDate: isValidDate(task.dueDate) ? task.dueDate : todayString(),
      createdAt: Number.isFinite(task.createdAt) ? task.createdAt : Date.now(),
    }));
}

export default function useTasks() {
  const [tasks, setTasks] = useLocalStorage(
    STORAGE_KEY,
    initialTasks,
    sanitizeTasks,
  );
  const [lastDeleted, setLastDeleted] = useState(null);

  useEffect(() => {
    if (!lastDeleted) return undefined;
    const timerId = setTimeout(() => setLastDeleted(null), UNDO_TIMEOUT_MS);
    return () => clearTimeout(timerId);
  }, [lastDeleted]);

  function addTask(data) {
    const error = validateTask(data);
    if (error) return { ok: false, error };

    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: createId(),
        title: data.title.trim(),
        completed: false,
        priority: data.priority,
        dueDate: data.dueDate,
        createdAt: Date.now(),
      },
    ]);
    return { ok: true };
  }

  function saveTask(id, data) {
    const error = validateTask(data);
    if (error) return { ok: false, error };

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: data.title.trim(),
              priority: data.priority,
              dueDate: data.dueDate,
            }
          : task,
      ),
    );
    return { ok: true };
  }

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id) {
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) return;

    setLastDeleted({ task: tasks[index], index });
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }

  function undoDelete() {
    if (!lastDeleted) return;
    const { task, index } = lastDeleted;
    setTasks((currentTasks) =>
      currentTasks.some((currentTask) => currentTask.id === task.id)
        ? currentTasks
        : [
            ...currentTasks.slice(0, index),
            task,
            ...currentTasks.slice(index),
          ],
    );
    setLastDeleted(null);
  }

  return {
    tasks,
    lastDeleted,
    addTask,
    saveTask,
    toggleTask,
    deleteTask,
    undoDelete,
  };
}
