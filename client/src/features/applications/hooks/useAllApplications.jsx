import { useState, useEffect, useCallback, useRef } from 'react';

// Frontend-only aggregation of ALL applications by paging through the API.
// No backend changes required.
// Usage: const { applications, isLoading, error, reload } = useAllApplications();
// It will fetch pages sequentially until all are loaded (pageSize per request configurable).

const PAGE_SIZE = 200; // tune if needed; larger = fewer requests, smaller = less per-call payload

export const useAllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0);
  const abortRef = useRef(null);

  const reload = useCallback(() => setReloadFlag(f => f + 1), []);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    let cancelled = false;

    async function loadAll() {
      setIsLoading(true);
      setError(null);
      try {
        const collected = [];
        let page = 1;
        let total = Infinity;
        while (!cancelled && collected.length < total) {
          const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
          const res = await fetch(`/api/applications?${params.toString()}`, { credentials: 'include', signal: controller.signal });
          if (!res.ok) throw new Error(`Failed to load applications page ${page} (${res.status})`);
          const json = await res.json();
          total = json.total || 0;
          const newItems = json.items || [];
          collected.push(...newItems);
          if (newItems.length === 0) break; // safety
          page += 1;
        }
        if (!cancelled) setApplications(collected);
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error('[useAllApplications] error', e);
          setError(e);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadAll();
    return () => { cancelled = true; controller.abort(); };
  }, [reloadFlag]);

  return { applications, isLoading, error, reload };
};
