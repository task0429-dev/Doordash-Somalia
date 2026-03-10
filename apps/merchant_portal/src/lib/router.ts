import { useEffect, useState } from 'react';

export function parseHash(hash: string): { path: string; params: Record<string, string> } {
  const clean = hash.replace(/^#/, '').replace(/^\//, '') || 'dashboard';
  const parts = clean.split('/').filter(Boolean);
  const path = parts[0] || 'dashboard';
  return { path, params: {} };
}

export function useHashRouter() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const handler = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  const navigate = (path: string) => { window.location.hash = path.startsWith('#') ? path.slice(1) : path; };
  return { ...route, navigate };
}
