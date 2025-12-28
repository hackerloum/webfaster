import { create } from 'zustand';
import { GenerationProgress, GenerationOptions } from '@/lib/types/editor';

interface GenerationState {
  prompt: string;
  options: GenerationOptions;
  isGenerating: boolean;
  progress: GenerationProgress | null;
  error: string | null;

  setPrompt: (prompt: string) => void;
  setOptions: (options: GenerationOptions) => void;
  setGenerating: (isGenerating: boolean) => void;
  setProgress: (progress: GenerationProgress | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  prompt: '',
  options: {},
  isGenerating: false,
  progress: null,
  error: null,

  setPrompt: (prompt) => set({ prompt }),
  setOptions: (options) => set({ options }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      prompt: '',
      options: {},
      isGenerating: false,
      progress: null,
      error: null,
    }),
}));
