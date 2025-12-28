import { create } from 'zustand';
import { WebsiteStructure, Section } from '@/lib/types/website';
import { nanoid } from 'nanoid';

interface WebsiteState {
  currentWebsite: WebsiteStructure | null;
  history: WebsiteStructure[];
  historyIndex: number;

  // Actions
  setWebsite: (website: WebsiteStructure) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  addSection: (section: Omit<Section, 'id' | 'order'>, position?: number) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  duplicateSection: (sectionId: string) => void;
  undo: () => void;
  redo: () => void;

  // Selectors
  getSection: (sectionId: string) => Section | undefined;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useWebsiteStore = create<WebsiteState>((set, get) => ({
  currentWebsite: null,
  history: [],
  historyIndex: -1,

  setWebsite: (website) => {
    set((state) => ({
      currentWebsite: website,
      history: [...state.history.slice(0, state.historyIndex + 1), website],
      historyIndex: state.historyIndex + 1,
    }));
  },

  updateSection: (sectionId, updates) => {
    const { currentWebsite } = get();
    if (!currentWebsite) return;

    const updatedSections = currentWebsite.sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            ...updates,
            metadata: {
              ...section.metadata,
              lastEditedAt: new Date(),
            },
          }
        : section
    );

    const updatedWebsite = {
      ...currentWebsite,
      sections: updatedSections,
      metadata: {
        ...currentWebsite.metadata,
        updatedAt: new Date(),
      },
    };

    get().setWebsite(updatedWebsite);
  },

  addSection: (section, position) => {
    const { currentWebsite } = get();
    if (!currentWebsite) return;

    const newSection: Section = {
      ...section,
      id: nanoid(),
      order: position ?? currentWebsite.sections.length,
    };

    const updatedSections = [...currentWebsite.sections];
    if (position !== undefined) {
      updatedSections.splice(position, 0, newSection);
      // Reorder all sections
      updatedSections.forEach((s, idx) => (s.order = idx));
    } else {
      updatedSections.push(newSection);
    }

    const updatedWebsite = {
      ...currentWebsite,
      sections: updatedSections,
      metadata: {
        ...currentWebsite.metadata,
        updatedAt: new Date(),
      },
    };

    get().setWebsite(updatedWebsite);
  },

  removeSection: (sectionId) => {
    const { currentWebsite } = get();
    if (!currentWebsite) return;

    const updatedSections = currentWebsite.sections
      .filter((s) => s.id !== sectionId)
      .map((s, idx) => ({ ...s, order: idx }));

    const updatedWebsite = {
      ...currentWebsite,
      sections: updatedSections,
      metadata: {
        ...currentWebsite.metadata,
        updatedAt: new Date(),
      },
    };

    get().setWebsite(updatedWebsite);
  },

  reorderSections: (fromIndex, toIndex) => {
    const { currentWebsite } = get();
    if (!currentWebsite) return;

    const updatedSections = [...currentWebsite.sections];
    const [movedSection] = updatedSections.splice(fromIndex, 1);
    if (!movedSection) return; // Guard against invalid index
    
    updatedSections.splice(toIndex, 0, movedSection);
    updatedSections.forEach((s, idx) => (s.order = idx));

    const updatedWebsite = {
      ...currentWebsite,
      sections: updatedSections,
      metadata: {
        ...currentWebsite.metadata,
        updatedAt: new Date(),
      },
    };

    get().setWebsite(updatedWebsite);
  },

  duplicateSection: (sectionId) => {
    const { currentWebsite } = get();
    if (!currentWebsite) return;

    const section = currentWebsite.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const duplicated = {
      ...section,
      id: nanoid(),
      order: section.order + 1,
    };

    get().addSection(duplicated, section.order + 1);
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      set({
        currentWebsite: history[historyIndex - 1],
        historyIndex: historyIndex - 1,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      set({
        currentWebsite: history[historyIndex + 1],
        historyIndex: historyIndex + 1,
      });
    }
  },

  getSection: (sectionId) => {
    const { currentWebsite } = get();
    return currentWebsite?.sections.find((s) => s.id === sectionId);
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
}));
