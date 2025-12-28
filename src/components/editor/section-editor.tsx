'use client';

import { useState } from 'react';
import { useWebsiteStore } from '@/store/website-store';
import { useEditorStore } from '@/store/editor-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ManualEditor } from './manual-editor';
import { AIEditor } from './ai-editor';

export function SectionEditor() {
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  const selectSection = useEditorStore((state) => state.selectSection);
  const getSection = useWebsiteStore((state) => state.getSection);
  const [activeTab, setActiveTab] = useState('manual');

  const section = selectedSectionId ? getSection(selectedSectionId) : null;

  if (!section) return null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div>
          <h3 className="font-semibold">Edit Section</h3>
          <p className="text-sm text-muted-foreground capitalize">{section.type}</p>
        </div>
        <Button size="icon" variant="ghost" onClick={() => selectSection(null)}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b border-gray-200 bg-transparent">
          <TabsTrigger value="manual">Manual Edit</TabsTrigger>
          <TabsTrigger value="ai">AI Edit</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="manual" className="mt-0 h-full">
            <ManualEditor section={section} />
          </TabsContent>

          <TabsContent value="ai" className="mt-0 h-full">
            <AIEditor section={section} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
