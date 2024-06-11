import { useState } from 'react';

function useLocalStorage(key, initialValue = null) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // If the item is a JWT or null/undefined, return it directly without parsing
      if (item === null || item === "undefined" || isJWT(item)) {
        return item;
      }
      // Otherwise, it's safe to parse the item as JSON
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading or parsing localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      // Determine if we're dealing with an object that needs JSON stringification
      const valueToStore =
        typeof value === 'object' ? JSON.stringify(value) : value;
      window.localStorage.setItem(key, valueToStore);
      setStoredValue(value);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Helper function to check if a string is a JWT
function isJWT(item) {
  const jwtPattern = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
  return jwtPattern.test(item);
}


export default useLocalStorage;
