/**
 * Utility functions for data handling
 */

/**
 * Deeply sanitizes data structures for Next.js static site generation
 * This ensures all objects are plain objects and all arrays are plain arrays
 * @param {any} data - The data to sanitize
 * @return {any} - The sanitized data
 */
export function sanitizeData(data) {
  try {
    // For null or undefined values, return an empty object
    if (data === null || data === undefined) {
      return {};
    }
    
    // Handle primitive types directly
    if (typeof data !== 'object') {
      return data;
    }
    
    // Handle arrays specifically
    if (Array.isArray(data)) {
      return data.map(item => sanitizeData(item));
    }
    
    // For dates, convert to ISO string
    if (data instanceof Date) {
      return data.toISOString();
    }
    
    // For regular objects, process each property
    const result = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = sanitizeData(data[key]);
      }
    }
    
    return result;
  } catch (e) {
    console.error("Error sanitizing data:", e);
    // Return a safe default based on input type
    return Array.isArray(data) ? [] : {};
  }
}

/**
 * Ensures that the input is a valid array
 * @param {any} possibleArray - The value to check
 * @param {Array} defaultValue - Default value if input is not an array
 * @return {Array} - A guaranteed array
 */
export function ensureArray(possibleArray, defaultValue = []) {
  try {
    // If it's already an array, return it
    if (Array.isArray(possibleArray)) {
      return possibleArray;
    }
    
    // If it's iterable (like a Set), convert to array
    if (possibleArray && typeof possibleArray[Symbol.iterator] === 'function' && 
        !(possibleArray instanceof String)) {
      return [...possibleArray];
    }
    
    // If it's null or undefined, return default
    if (possibleArray === null || possibleArray === undefined) {
      return defaultValue;
    }
    
    // For anything else, wrap in array
    return [possibleArray];
  } catch (e) {
    console.error("Error ensuring array:", e);
    return defaultValue;
  }
} 