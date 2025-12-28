export interface WebsiteMetadata {
  title: string;
  description: string;
  favicon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SectionType =
  | 'hero'
  | 'about'
  | 'features'
  | 'services'
  | 'pricing'
  | 'testimonials'
  | 'team'
  | 'contact'
  | 'footer'
  | 'cta'
  | 'gallery'
  | 'custom';

export interface SectionStyles {
  backgroundColor?: string;
  backgroundImage?: string;
  textColor?: string;
  padding?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  margin?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  borderRadius?: string;
  boxShadow?: string;
  customCSS?: string;
}

export interface EditHistoryEntry {
  timestamp: Date;
  type: 'manual' | 'ai';
  description: string;
  changes: Record<string, unknown>;
}

export interface Section {
  id: string;
  type: SectionType;
  content: Record<string, any>;
  styles: SectionStyles;
  order: number;
  visible: boolean;
  metadata: {
    generatedByAI: boolean;
    lastEditedAt: Date;
    editHistory: EditHistoryEntry[];
  };
}

export interface GlobalStyles {
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    headingFont?: string;
    fontSize: {
      base: string;
      h1: string;
      h2: string;
      h3: string;
      h4: string;
    };
  };
  spacing: {
    sectionGap: string;
    containerPadding: string;
  };
}

export interface Asset {
  id: string;
  url: string;
  type: 'image' | 'video' | 'icon';
  alt?: string;
  metadata?: Record<string, unknown>;
}

export interface WebsiteStructure {
  id: string;
  metadata: WebsiteMetadata;
  sections: Section[];
  globalStyles: GlobalStyles;
  assets: Asset[];
}
