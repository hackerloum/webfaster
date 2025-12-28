import { WebsiteStructure, Section } from './website';

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface AIGenerationResponse {
  website: WebsiteStructure;
  tokensUsed: number;
  generationTime: number;
}

export interface AISectionModificationResponse {
  section: Section;
  explanation: string;
  tokensUsed: number;
}
