// src/hooks/useLocalStorage.js
// Generic React hook that syncs one piece of component state with one
// Local Storage key (e.g. theme preference, notification toggle). For the
// students list and login/session state, use utils/localStorage.js +
// AuthContext instead — that data needs cross-record logic this hook doesn't do.

import { useState, useEffect, useCallback } from "react";

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch (error) {
      console.error(`useLocalStorage: failed to read "${key}"`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`useLocalStorage: failed to write "${key}"`, error);
    }
  }, [key, value]);

  // Keep state in sync if the same key changes in another browser tab.
  useEffect(() => {
    function handleStorageEvent(event) {
      if (event.key === key && event.newValue !== null) {
        try {
          setValue(JSON.parse(event.newValue));
        } catch {
          // ignore malformed external updates
        }
      }
    }
    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, [key]);

  const remove = useCallback(() => {
    localStorage.removeItem(key);
    setValue(initialValue);
  }, [key, initialValue]);

  return [value, setValue, remove];
}