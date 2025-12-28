export type EditorMode = 'preview' | 'manual' | 'ai-edit';

export interface EditorState {
  mode: EditorMode;
  selectedSectionId: string | null;
  selectedElementPath: string | null;
  isGenerating: boolean;
  isSaving: boolean;
}

export interface GenerationOptions {
  stylePreference?: 'modern' | 'minimal' | 'bold' | 'elegant' | 'playful';
  colorScheme?: string;
  industry?: string;
  targetAudience?: string;
}

export interface GenerationRequest {
  prompt: string;
  options?: GenerationOptions;
}

export interface GenerationProgress {
  step: number;
  totalSteps: number;
  currentStep: string;
  estimatedTimeRemaining?: number;
}
