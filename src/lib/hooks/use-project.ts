import { useState, useEffect } from 'react';
import { useWebsiteStore } from '@/store/website-store';

export function useProject(projectId: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentWebsite = useWebsiteStore((state) => state.currentWebsite);
  const setWebsite = useWebsiteStore((state) => state.setWebsite);

  useEffect(() => {
    if (projectId && projectId !== currentWebsite?.id) {
      loadProject(projectId);
    }
  }, [projectId]);

  const loadProject = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${id}`);
      if (!response.ok) throw new Error('Failed to load project');
      const data = await response.json();
      if (data.success && data.data) {
        setWebsite(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, website: currentWebsite };
}
