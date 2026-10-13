// All communication with the Express backend lives here.
const BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors || null; // field-level messages from the server
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      credentials: 'include', // send the HttpOnly login cookie
      headers: {
        'X-Requested-With': 'DayCraft', // required by the server's CSRF guard
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('Cannot reach the server. Check that the backend is running and try again.', 0);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* response had no JSON body */
  }

  if (!res.ok) {
    throw new ApiError(data?.message || 'Something went wrong. Please try again.', res.status, data?.errors);
  }
  return data;
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),

  getTasks: (filters = {}, signal) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
    const qs = params.toString();
    return request(`/tasks${qs ? `?${qs}` : ''}`, { signal });
  },
  createTask: (body) => request('/tasks', { method: 'POST', body }),
  updateTask: (id, body) => request(`/tasks/${id}`, { method: 'PUT', body }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};
