import { useState, useEffect, useCallback } from 'react';

// Hook to fetch paginated applications from the API
export const useApplications = (filters = {}, page = 1, pageSize = 20) => {
  const [data, setData] = useState({ items: [], total: 0, page, pageSize });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  const reload = useCallback(() => setReloadFlag(f => f + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set('page', page);
        params.set('pageSize', pageSize);
        if (filters.search) params.set('search', filters.search);
        if (filters.status?.length) params.set('status', filters.status.join(','));
        if (filters.source) params.set('source', filters.source);
        if (filters.technologies?.length) params.set('technologies', filters.technologies.join(','));
        const res = await fetch(`/api/applications?${params.toString()}`, {
          credentials: 'include',
          signal: controller.signal
        });
        if (!res.ok) throw new Error(`Failed to load applications (${res.status})`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        if (e.name !== 'AbortError') setError(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [filters, page, pageSize, reloadFlag]);

  return { data, isLoading, error, reload };
};

export const useApplication = (id) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/applications/${id}`, { credentials: 'include', signal: controller.signal });
        if (!res.ok) throw new Error('Failed to load application');
        const json = await res.json();
        setData(json);
      } catch (e) {
        if (e.name !== 'AbortError') setError(e);
      } finally {
        setIsLoading(false);
      }
    })();
    return () => controller.abort();
  }, [id]);

  return { data, isLoading, error };
};