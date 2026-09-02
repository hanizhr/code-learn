/**
 * Vanilla JS Client-Side Router
 * Supports hash routes, dynamic parameters, route guards, and title updates.
 */

import { AuthManager } from "./auth.js";
import { appState } from "./state.js";

export class Router {
  constructor(routes = {}, rootElementId = "main-app-container") {
    this.routes = routes;
    this.rootElement = document.getElementById(rootElementId);
    this.currentRoute = null;
    this.currentParams = {};

    window.addEventListener("hashchange", () => this.handleRouteChange());
  }

  init() {
    if (!window.location.hash) {
      window.location.hash = "#/";
    }
    this.handleRouteChange();
  }

  navigate(path) {
    window.location.hash = path.startsWith("#") ? path : `#${path}`;
  }

  handleRouteChange() {
    const hash = window.location.hash.slice(1) || "/";
    const [pathOnly, queryString] = hash.split("?");
    const queryParams = new URLSearchParams(queryString || "");

    const matched = this._matchRoute(pathOnly);

    if (!matched) {
      console.warn(`Route not found for hash "${hash}". Falling back to 404.`);
      if (this.routes["/404"]) {
        this._renderRoute(this.routes["/404"], {}, queryParams);
      }
      return;
    }

    const { routeHandler, params, routeConfig } = matched;

    // Route guards
    if (routeConfig.requiresAuth && !AuthManager.isAuthenticated()) {
      this.navigate(`/auth?redirect=${encodeURIComponent(hash)}`);
      return;
    }

    if (routeConfig.role && AuthManager.isAuthenticated()) {
      const user = AuthManager.getCurrentUser();
      if (user.role !== routeConfig.role && user.role !== "admin") {
        if (user.role === "teacher") {
          this.navigate("/dashboard/teacher");
        } else {
          this.navigate("/dashboard/student");
        }
        return;
      }
    }

    this.currentRoute = pathOnly;
    this.currentParams = params;
    this._renderRoute(routeHandler, params, queryParams, routeConfig);
  }

  _matchRoute(path) {
    // Exact match first
    if (this.routes[path]) {
      return {
        routeHandler: this.routes[path].handler,
        routeConfig: this.routes[path],
        params: {}
      };
    }

    // Dynamic pattern match (e.g. /courses/:id or /teachers/:id)
    const routeKeys = Object.keys(this.routes);
    for (const key of routeKeys) {
      if (!key.includes(":")) continue;

      const patternParts = key.split("/");
      const pathParts = path.split("/");

      if (patternParts.length !== pathParts.length) continue;

      const params = {};
      let match = true;

      for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(":")) {
          const paramName = patternParts[i].slice(1);
          params[paramName] = decodeURIComponent(pathParts[i]);
        } else if (patternParts[i] !== pathParts[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        return {
          routeHandler: this.routes[key].handler,
          routeConfig: this.routes[key],
          params
        };
      }
    }

    return null;
  }

  async _renderRoute(handler, params, queryParams, routeConfig = {}) {
    this.rootElement = document.getElementById("main-app-container") || document.body;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Update document title
    if (routeConfig.title) {
      document.title = `${routeConfig.title} | کدلرن`;
    }

    // Notify state of route change
    appState.emit("route:changed", {
      route: this.currentRoute,
      params,
      queryParams
    });

    // Execute page component render
    try {
      await handler(this.rootElement, params, queryParams);
    } catch (err) {
      console.error("Error rendering route:", err);
      this.rootElement.innerHTML = `
        <div class="container" style="padding: 4rem 1rem;">
          <div class="error-state">
            <h3>خطا در بارگذاری صفحه</h3>
            <p>${err.message || "مشکلی در بارگذاری داده‌های این صفحه رخ داده است."}</p>
            <button class="btn btn-primary" onclick="window.location.reload()">تلاش مجدد</button>
          </div>
        </div>
      `;
    }
  }
}
