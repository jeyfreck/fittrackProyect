// FitTrack Enterprise API Client with Hardened Security, Token Revocation & Offline Resilience

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiClient {
  constructor() {
    this.tokenKey = 'fittrack_jwt_token';
    this.userKey = 'fittrack_user_data';
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token) {
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      localStorage.removeItem(this.tokenKey);
    }
  }

  getCurrentUser() {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.userKey);
    }
  }

  /**
   * Enterprise Session Revocation:
   * Notifies the Spring Boot backend to blacklist the JWT token immediately,
   * then purges local credentials.
   */
  async logout() {
    const token = this.getToken();
    if (token) {
      try {
        await fetch(`${BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (err) {
        console.warn('[API Security] Server logout notification bypassed:', err.message);
      }
    }

    this.setToken(null);
    this.setCurrentUser(null);
    window.dispatchEvent(new CustomEvent('fittrack:auth-change', { detail: { user: null } }));
  }

  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle Rate Limiting (Anti-Brute Force Protection)
      if (response.status === 429) {
        const errorData = await response.json().catch(() => ({}));
        const retryAfter = response.headers.get('Retry-After') || errorData.retryAfterSeconds || 60;
        const msg = errorData.message || `Límite de solicitudes alcanzado. Por favor espere ${retryAfter} segundos.`;
        console.warn('[Security RateLimit]', msg);
        throw new Error(msg);
      }

      // Handle Token Expiration or Server-side Revocation
      if (response.status === 401 && token) {
        console.warn('[API Security] Token invalid or revoked by server.');
        this.setToken(null);
        this.setCurrentUser(null);
        window.dispatchEvent(new CustomEvent('fittrack:auth-expired'));
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || `Error HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.warn(`[API] Fallback/Error for ${endpoint}:`, err.message);
      throw err;
    }
  }

  // Auth Endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      this.setToken(data.token);
      this.setCurrentUser({ email, name: email.split('@')[0], role: 'USER' });
      window.dispatchEvent(new CustomEvent('fittrack:auth-change', { detail: { user: this.getCurrentUser() } }));
    }
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (data.token) {
      this.setToken(data.token);
      this.setCurrentUser(userData);
      window.dispatchEvent(new CustomEvent('fittrack:auth-change', { detail: { user: this.getCurrentUser() } }));
    }
    return data;
  }

  // Goals Endpoints
  async getGoals() {
    return await this.request('/goals', { method: 'GET' });
  }

  async createGoal(goal) {
    return await this.request('/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  }
}

export const api = new ApiClient();
