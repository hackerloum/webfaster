'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWebsiteStore } from '@/store/website-store';
import { useEditorStore } from '@/store/editor-store';
import { WebsitePreview } from '@/components/preview/website-preview';
import { SectionEditor } from '@/components/editor/section-editor';
import { EditorToolbar } from '@/components/editor/editor-toolbar';
import { SectionNavigator } from '@/components/editor/section-navigator';
import { useProject } from '@/lib/hooks/use-project';
import { Loader2 } from 'lucide-react';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const currentWebsite = useWebsiteStore((state) => state.currentWebsite);
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  const [showNavigator, setShowNavigator] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { isLoading, error } = useProject(projectId);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0A0F]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0A0F]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-white/60">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0A0F]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">Error loading project</h2>
          <p className="text-white/60 mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!currentWebsite) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0A0F]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">No website loaded</h2>
          <p className="text-white/60 mb-4">Please generate a website first.</p>
          <button
            onClick={() => router.push('/?generate=true')}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Create Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0A0A0F] overflow-hidden">
      {/* Section Navigator */}
      {showNavigator && (
        <div className="w-72 bg-[#111118] border-r border-white/10 overflow-y-auto custom-scrollbar">
          <SectionNavigator />
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <EditorToolbar onToggleNavigator={() => setShowNavigator(!showNavigator)} />

        {/* Split View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Preview */}
          <div className="flex-1 overflow-auto bg-[#0A0A0F]">
            <WebsitePreview />
          </div>

          {/* Editor Panel */}
          {selectedSectionId && (
            <div className="w-[420px] bg-[#111118] border-l border-white/10 overflow-y-auto custom-scrollbar flex-shrink-0">
              <SectionEditor />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
