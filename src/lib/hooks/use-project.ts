import { useState, useEffect, useCallback } from 'react';
import { useWebsiteStore } from '@/store/website-store';

export function useProject(projectId: string | null) {
  const [isLoading, setIsLoading] = useState(!!projectId); // Start loading if projectId exists
  const [error, setError] = useState<string | null>(null);
  const currentWebsite = useWebsiteStore((state) => state.currentWebsite);
  const setWebsite = useWebsiteStore((state) => state.setWebsite);

  const loadProject = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${id}`);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view this project');
        }
        if (response.status === 403) {
          throw new Error('You do not have access to this project');
        }
        if (response.status === 404) {
          throw new Error('Project not found');
        }
        throw new Error('Failed to load project');
      }
      const data = await response.json();
      if (data.success && data.data) {
        // Ensure the website data has the correct ID
        const websiteData = { ...data.data, id: id };
        setWebsite(websiteData);
      } else {
        throw new Error(data.error?.message || 'Failed to load project');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [setWebsite]);

  useEffect(() => {
    if (projectId) {
      // Always load if projectId is provided, even if it matches currentWebsite.id
      // This ensures we load on page refresh
      if (projectId !== currentWebsite?.id) {
        loadProject(projectId);
      } else {
        // If IDs match, we're already loaded
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
    // Zustand selectors are stable, so setWebsite doesn't need to be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, loadProject]);

  return { isLoading, error, website: currentWebsite };
}
