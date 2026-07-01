const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = {
  get: (path, token) =>
    fetch(BASE + path, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
  post: (path, body, token) =>
    fetch(BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    }).then(r => r.json()),
}
