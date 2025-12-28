'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useWebsiteStore } from '@/store/website-store';
import { useEditorStore } from '@/store/editor-store';
import { WebsitePreview } from '@/components/preview/website-preview';
import { SectionEditor } from '@/components/editor/section-editor';
import { EditorToolbar } from '@/components/editor/editor-toolbar';
import { SectionNavigator } from '@/components/editor/section-navigator';

export default function EditorPage() {
  const params = useParams();
  const currentWebsite = useWebsiteStore((state) => state.currentWebsite);
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  const [showNavigator, setShowNavigator] = useState(true);

  if (!currentWebsite) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">No website loaded</h2>
          <p className="text-muted-foreground">Please generate a website first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Section Navigator */}
      {showNavigator && (
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <SectionNavigator />
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <EditorToolbar onToggleNavigator={() => setShowNavigator(!showNavigator)} />

        {/* Split View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Preview */}
          <div className="flex-1 overflow-auto">
            <WebsitePreview />
          </div>

          {/* Editor Panel */}
          {selectedSectionId && (
            <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
              <SectionEditor />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
