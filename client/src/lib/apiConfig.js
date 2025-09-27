// Central place to determine API base URL in the client.
// Priority: explicit VITE_API_BASE env -> same host different port (3000) fallback.
export const API_BASE = import.meta.env.VITE_API_BASE || inferLocalApiBase();

function inferLocalApiBase() {
  try {
    const loc = window.location;
    // If already on port 3000 assume same origin
    if (loc.port === '3000') return `${loc.origin}`;
    // Replace current port with 3000 for dev server pairing
    return `${loc.protocol}//${loc.hostname}:3000`;
  } catch {
    return 'http://localhost:3000';
  }
}

export function withApi(path) {
  return `${API_BASE}${path.startsWith('/') ? path : '/' + path}`;
}