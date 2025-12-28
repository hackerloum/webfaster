import { create } from 'zustand';
import { EditorMode } from '@/lib/types/editor';

interface EditorState {
  mode: EditorMode;
  selectedSectionId: string | null;
  isGenerating: boolean;
  isSaving: boolean;
  viewportSize: 'desktop' | 'tablet' | 'mobile';
  zoomLevel: number;

  setMode: (mode: EditorMode) => void;
  selectSection: (sectionId: string | null) => void;
  setGenerating: (isGenerating: boolean) => void;
  setSaving: (isSaving: boolean) => void;
  setViewportSize: (size: 'desktop' | 'tablet' | 'mobile') => void;
  setZoomLevel: (level: number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  mode: 'preview',
  selectedSectionId: null,
  isGenerating: false,
  isSaving: false,
  viewportSize: 'desktop',
  zoomLevel: 100,

  setMode: (mode) => set({ mode }),
  selectSection: (sectionId) => set({ selectedSectionId: sectionId }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setSaving: (isSaving) => set({ isSaving }),
  setViewportSize: (size) => set({ viewportSize: size }),
  setZoomLevel: (level) => set({ zoomLevel: level }),
}));
