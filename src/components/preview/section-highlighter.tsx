'use client';

import { useEffect } from 'react';
import { useEditorStore } from '@/store/editor-store';

export function SectionHighlighter() {
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);

  useEffect(() => {
    // This component can be used to highlight sections in the preview
    // The actual highlighting is handled via CSS in the HTML generator
  }, [selectedSectionId]);

  return null;
}
