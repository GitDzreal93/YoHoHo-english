import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const readValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    // Listen for changes to local storage
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue] as const;
}

// Hook for secure local storage (for sensitive data)
export function useSecureStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Simple encryption/decryption (in production, use a proper encryption library)
  const encrypt = (data: T): string => {
    try {
      return btoa(JSON.stringify(data));
    } catch (error) {
      console.warn('Error encrypting data:', error);
      return '';
    }
  };

  const decrypt = (encryptedData: string): T | null => {
    try {
      return JSON.parse(atob(encryptedData));
    } catch (error) {
      console.warn('Error decrypting data:', error);
      return null;
    }
  };

  // Read value from secure storage
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(`secure_${key}`);
      if (item) {
        const decryptedValue = decrypt(item);
        if (decryptedValue !== null) {
          setStoredValue(decryptedValue);
        }
      }
    } catch (error) {
      console.warn(`Error reading secure localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      const encrypted = encrypt(valueToStore);

      setStoredValue(valueToStore);
      window.localStorage.setItem(`secure_${key}`, encrypted);
    } catch (error) {
      console.warn(`Error setting secure localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Hook for managing arrays in localStorage
export function useLocalStorageArray<T>(key: string, initialValue: T[] = []) {
  const [array, setArray] = useLocalStorage<T[]>(key, initialValue);

  const addItem = (item: T) => {
    setArray(prev => [...prev, item]);
  };

  const removeItem = (index: number) => {
    setArray(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, item: T) => {
    setArray(prev => {
      const newArray = [...prev];
      newArray[index] = item;
      return newArray;
    });
  };

  const clear = () => {
    setArray([]);
  };

  const toggleItem = (item: T, compareFn?: (a: T, b: T) => boolean) => {
    setArray(prev => {
      const exists = compareFn
        ? prev.some(p => compareFn(p, item))
        : prev.includes(item);

      if (exists) {
        return compareFn
          ? prev.filter(p => !compareFn(p, item))
          : prev.filter(p => p !== item);
      } else {
        return [...prev, item];
      }
    });
  };

  return {
    array,
    setArray,
    addItem,
    removeItem,
    updateItem,
    clear,
    toggleItem,
  };
}

// Hook for managing objects in localStorage
export function useLocalStorageObject<T extends Record<string, any>>(
  key: string,
  initialValue: T
) {
  const [object, setObject] = useLocalStorage<T>(key, initialValue);

  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setObject(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const removeField = (field: keyof T) => {
    const newObject = { ...object };
    delete newObject[field];
    setObject(newObject as T);
  };

  const merge = (updates: Partial<T>) => {
    setObject(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const reset = () => {
    setObject(initialValue);
  };

  return {
    object,
    setObject,
    updateField,
    removeField,
    merge,
    reset,
  };
}

// Hook for session storage
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Hook for localStorage cleanup
export function useLocalStorageCleanup() {
  const clearExpired = (maxAge: number = 7 * 24 * 60 * 60 * 1000) => { // 7 days default
    try {
      const now = Date.now();
      const keys = Object.keys(window.localStorage);

      keys.forEach(key => {
        const item = window.localStorage.getItem(key);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            if (parsed.timestamp && (now - parsed.timestamp) > maxAge) {
              window.localStorage.removeItem(key);
            }
          } catch {
            // If parsing fails, remove the item
            window.localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn('Error cleaning up localStorage:', error);
    }
  };

  const clearAll = () => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  };

  const clearByKey = (pattern: string) => {
    try {
      const keys = Object.keys(window.localStorage);
      keys.forEach(key => {
        if (key.includes(pattern)) {
          window.localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn(`Error clearing localStorage keys matching "${pattern}":`, error);
    }
  };

  return {
    clearExpired,
    clearAll,
    clearByKey,
  };
}