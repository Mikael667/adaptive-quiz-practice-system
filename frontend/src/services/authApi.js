const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const responseText = await response.text();
  let body = {};
  try {
    body = responseText ? JSON.parse(responseText) : {};
  } catch {
    body = {};
  }
  if (!response.ok) {
    const detail = body.error || body.message || responseText || response.statusText;
    throw new Error(`Request failed (HTTP ${response.status}): ${detail}`);
  }
  return body;
}

export const register = (payload) => request('/api/auth/register', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const login = (payload) => request('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const logout = () => request('/api/auth/logout', { method: 'POST' });
