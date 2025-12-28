'use client';

import { useWebsiteStore } from '@/store/website-store';
import { useEditorStore } from '@/store/editor-store';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function SectionNavigator() {
  const currentWebsite = useWebsiteStore((state) => state.currentWebsite);
  const { selectSection, selectedSectionId } = useEditorStore();
  const { removeSection, duplicateSection } = useWebsiteStore();

  if (!currentWebsite) {
    return (
      <div className="p-6 text-center text-white/40">
        <p>No website loaded</p>
      </div>
    );
  }

  const sortedSections = [...currentWebsite.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white text-base">Sections</h3>
        <Button 
          size="sm" 
          variant="ghost"
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {sortedSections.map((section) => (
          <div
            key={section.id}
            className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
              selectedSectionId === section.id
                ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 shadow-lg shadow-purple-500/10'
                : 'hover:bg-white/5 border border-transparent'
            }`}
            onClick={() => selectSection(section.id)}
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white capitalize truncate">
                {section.type}
              </div>
              {section.metadata.generatedByAI && (
                <div className="text-xs text-purple-400/70 mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400/70"></span>
                  AI Generated
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateSection(section.id);
                  toast.success('Section duplicated');
                }}
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSection(section.id);
                  toast.success('Section removed');
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
