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
    <div className="h-full flex flex-col bg-[#111118]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/10">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-white text-sm md:text-base">Edit Section</h3>
          <p className="text-xs md:text-sm text-white/50 capitalize mt-0.5 truncate">{section.type}</p>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={() => selectSection(null)}
          className="text-white/70 hover:text-white hover:bg-white/10 flex-shrink-0 ml-2"
          title="Close"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Editor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b border-white/10 bg-transparent px-4 md:px-6">
          <TabsTrigger 
            value="manual"
            className="text-white/70 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-purple-400 text-xs md:text-sm px-3 md:px-4"
          >
            Manual
          </TabsTrigger>
          <TabsTrigger 
            value="ai"
            className="text-white/70 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-purple-400 text-xs md:text-sm px-3 md:px-4"
          >
            AI
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
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
