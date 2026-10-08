import { useEffect, useState } from "react";

export default function useLocalStorage(key, initialValue, sanitize) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return initialValue;

      const parsed = JSON.parse(raw);
      return sanitize ? sanitize(parsed, initialValue) : parsed;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  }, [key, value]);

  return [value, setValue];
}
