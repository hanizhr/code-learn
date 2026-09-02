/**
 * Reactive Global State & EventBus (Pub/Sub)
 */

class StateManager {
  constructor() {
    this.state = {
      user: null,
      notifications: [],
      unreadCount: 0,
      activeFilter: {
        subject: "",
        level: "",
        searchQuery: ""
      },
      theme: "light"
    };
    this.listeners = new Map();
  }

  getState() {
    return { ...this.state };
  }

  setState(newState) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...newState };
    this.emit("stateChanged", { state: this.state, prevState });
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, payload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`Error in event listener for "${event}":`, err);
        }
      });
    }
  }
}

export const appState = new StateManager();
