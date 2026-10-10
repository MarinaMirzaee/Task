import { isValidDate } from "./dates.js";
import { PRIORITIES, MAX_TITLE_LENGTH, ERRORS } from "../Constants.js";

export function validateTask(task) {
  const { title, priority, dueDate } = task ?? {};
  const trimmed = typeof title === "string" ? title.trim() : "";
  if (!trimmed) return ERRORS.TITLE_REQUIRED;
  if (trimmed.length > MAX_TITLE_LENGTH) return ERRORS.TITLE_TOO_LONG;
  if (typeof dueDate !== "string" || !dueDate.trim()) {
    return ERRORS.DATE_REQUIRED;
  }
  if (!isValidDate(dueDate)) return ERRORS.DATE_INVALID;
  if (typeof priority !== "string" || !PRIORITIES.includes(priority)) {
    return ERRORS.PRIORITY_INVALID;
  }
  return "";
}
