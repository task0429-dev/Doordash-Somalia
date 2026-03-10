import { useEffect, useState } from 'react';

export type RouteState = {
  path: string;
  params: Record<string, string>;
  segments: string[];
};

export function parseHash(hash: string): RouteState {
  const cleanHash = hash.replace(/^#/, '').replace(/^\//, '') || 'home';
  const [pathname] = cleanHash.split('?');
  const segments = pathname.split('/').filter(Boolean);
  const path = segments[0] ?? 'splash';
  const params: Record<string, string> = {};

  if (path === 'restaurant' && segments[1]) params.id = decodeURIComponent(segments[1]);
  if (path === 'category' && segments[1]) params.id = decodeURIComponent(segments[1]);
  if (path === 'tracking' && segments[1]) params.id = decodeURIComponent(segments[1]);
  if (path === 'orders' && segments[1]) params.id = decodeURIComponent(segments[1]);

  return { path, params, segments };
}

export function useHashRouter() {
  const [route, setRoute] = useState<RouteState>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (path: string) => {
    const next = path.startsWith('#') ? path.slice(1) : path;
    window.location.hash = next.startsWith('/') ? next : `/${next}`;
  };

  return { ...route, navigate };
}
