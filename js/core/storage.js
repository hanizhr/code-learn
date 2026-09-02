/**
 * Storage Layer with LocalStorage wrapper and Mock Data Seed
 */

import { CONFIG } from "./config.js";

class StorageManager {
  constructor(prefix = CONFIG.STORAGE_PREFIX) {
    this.prefix = prefix;
  }

  _getKey(key) {
    return `${this.prefix}${key}`;
  }

  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(this._getKey(key));
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch (err) {
      console.error(`StorageManager get error for key "${key}":`, err);
      return defaultValue;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(this._getKey(key), JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`StorageManager set error for key "${key}":`, err);
      return false;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(this._getKey(key));
      return true;
    } catch (err) {
      console.error(`StorageManager remove error for key "${key}":`, err);
      return false;
    }
  }

  clearAll() {
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(this.prefix)) {
          localStorage.removeItem(k);
        }
      });
      return true;
    } catch (err) {
      console.error("StorageManager clearAll error:", err);
      return false;
    }
  }
}

export const storage = new StorageManager();
