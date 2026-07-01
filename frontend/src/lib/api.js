const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function withBody(method) {
  return (path, body, token) =>
    fetch(BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    }).then(r => r.json())
}

export const api = {
  get: (path, token) =>
    fetch(BASE + path, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
  post: withBody('POST'),
  put: withBody('PUT'),
  patch: withBody('PATCH'),
  delete: (path, token) =>
    fetch(BASE + path, {
      method: 'DELETE',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    }).then(r => (r.status === 204 ? null : r.json())),
}
