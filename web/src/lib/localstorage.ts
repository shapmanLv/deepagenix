/**
 * Creates a storage accessor instance for a specified key
 *
 * @param key - The key under which the value is stored
 * @param defaultValue - Default value returned when key doesn't exist
 * @param place - Storage type: 'local' (default) or 'session'
 */
export const createLocalInstance = <T = string>(
  key: string,
  defaultValue?: T,
  place: 'local' | 'session' = 'local'
) => {
  const storage = place === 'local' ? localStorage : sessionStorage

  return {
    /**
     * Retrieves stored value, parsing JSON data
     * Returns defaultValue if key doesn't exist or parsing fails
     */
    get: (): T | undefined => {
      const storedValue = storage.getItem(key)
      if (storedValue === null) return defaultValue
      try {
        return JSON.parse(storedValue) as T
      } catch {
        return defaultValue
      }
    },

    /**
     * Stores value with JSON serialization
     * Removes key when value is undefined/null
     */
    set: (value?: T): void => {
      if (value == null) {
        storage.removeItem(key)
      } else {
        storage.setItem(key, JSON.stringify(value))
      }
    },
  }
}
