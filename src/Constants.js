import { todayString } from "./utils/dates.js";

export const STORAGE_KEY = "task-list-v1";
export const PRIORITIES = ["Low", "Medium", "High"];
export const DEFAULT_PRIORITY = "Medium";
export const FILTERS = ["All", "Active", "Completed"];
export const PRIORITY_FILTERS = ["All", ...PRIORITIES];
export const SORT_OPTIONS = ["Newest", "Oldest", "Due Date"];
export const UNDO_TIMEOUT_MS = 5000;
export const MAX_TITLE_LENGTH = 100;

export const ERRORS = {
  TITLE_REQUIRED: "Task title cannot be empty.",
  TITLE_TOO_LONG: `Title must be at most ${MAX_TITLE_LENGTH} characters.`,
  DATE_REQUIRED: "Due date is required.",
  DATE_INVALID: "Invalid date. Please choose a real date.",
  PRIORITY_INVALID: "Please choose a valid priority.",
};

const today = todayString();

export const initialTasks = [
  {
    id: "initial-1",
    title: "Learn React",
    completed: false,
    priority: "Medium",
    dueDate: today,
    createdAt: 1,
  },
  {
    id: "initial-2",
    title: "Practice JavaScript",
    completed: false,
    priority: "Medium",
    dueDate: today,
    createdAt: 2,
  },
  {
    id: "initial-3",
    title: "Build a Project",
    completed: false,
    priority: "High",
    dueDate: today,
    createdAt: 3,
  },
];
