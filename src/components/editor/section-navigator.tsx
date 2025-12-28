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
      <div className="p-4 text-center text-muted-foreground">
        <p>No website loaded</p>
      </div>
    );
  }

  const sortedSections = [...currentWebsite.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Sections</h3>
        <Button size="sm" variant="ghost">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-1">
        {sortedSections.map((section) => (
          <div
            key={section.id}
            className={`group flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
              selectedSectionId === section.id
                ? 'bg-primary/10 border border-primary'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => selectSection(section.id)}
          >
            <div className="flex-1">
              <div className="text-sm font-medium capitalize">{section.type}</div>
              {section.metadata.generatedByAI && (
                <div className="text-xs text-muted-foreground">AI Generated</div>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateSection(section.id);
                  toast.success('Section duplicated');
                }}
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSection(section.id);
                  toast.success('Section removed');
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
