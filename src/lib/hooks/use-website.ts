import { useWebsiteStore } from '@/store/website-store';
import { WebsiteStructure } from '@/lib/types/website';

export function useWebsite() {
  const currentWebsite = useWebsiteStore((state) => state.currentWebsite);
  const setWebsite = useWebsiteStore((state) => state.setWebsite);
  const updateSection = useWebsiteStore((state) => state.updateSection);
  const addSection = useWebsiteStore((state) => state.addSection);
  const removeSection = useWebsiteStore((state) => state.removeSection);

  return {
    website: currentWebsite,
    setWebsite,
    updateSection,
    addSection,
    removeSection,
  };
}
