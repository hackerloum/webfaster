'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Save, Undo, Redo, Download, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWebsiteStore } from '@/store/website-store';
import { useEditorStore } from '@/store/editor-store';
import { toast } from 'react-hot-toast';
import { ExportModal } from '@/components/export/export-modal';

interface EditorToolbarProps {
  onToggleNavigator: () => void;
}

export function EditorToolbar({ onToggleNavigator }: EditorToolbarProps) {
  const params = useParams();
  const projectId = params.id as string;
  const currentWebsite = useWebsiteStore((state) => state.currentWebsite);
  const { undo, redo, canUndo, canRedo } = useWebsiteStore();
  const { isSaving, setSaving } = useEditorStore();
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const handleSave = async () => {
    if (!currentWebsite || !projectId) {
      toast.error('Project ID not found');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentWebsite.metadata.title,
          description: currentWebsite.metadata.description,
          data: currentWebsite,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to save');
      }

      toast.success('Project saved successfully');
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 bg-[#111118] border-b border-white/10 backdrop-blur-xl">
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onToggleNavigator}
          className="text-white/70 hover:text-white hover:bg-white/10 flex-shrink-0"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="h-6 w-px bg-white/10 hidden md:block" />
        <h2 className="text-sm md:text-lg font-semibold text-white truncate">
          {currentWebsite?.metadata.title || 'Untitled Project'}
        </h2>
      </div>

      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
        <Button
          size="sm"
          variant="ghost"
          onClick={undo}
          disabled={!canUndo()}
          className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 p-2 md:px-3"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
          <span className="hidden md:inline ml-1.5">Undo</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={redo}
          disabled={!canRedo()}
          className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 p-2 md:px-3"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
          <span className="hidden md:inline ml-1.5">Redo</span>
        </Button>
        <div className="h-6 w-px bg-white/10 mx-1 hidden md:block" />
        <Button
          size="sm"
          variant="outline"
          onClick={handleSave}
          disabled={isSaving || !currentWebsite}
          className="bg-white/5 text-white border-white/20 hover:bg-white/10 disabled:opacity-30 p-2 md:px-3 text-xs md:text-sm"
          title="Save"
        >
          <Save className="w-4 h-4" />
          <span className="hidden md:inline ml-1.5">{isSaving ? 'Saving...' : 'Save'}</span>
        </Button>
        <Button
          size="sm"
          variant="default"
          onClick={() => setExportModalOpen(true)}
          disabled={!currentWebsite}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 disabled:opacity-30 shadow-lg shadow-purple-500/20 p-2 md:px-3 text-xs md:text-sm"
          title="Export"
        >
          <Download className="w-4 h-4" />
          <span className="hidden md:inline ml-1.5">Export</span>
        </Button>
      </div>

      <ExportModal open={exportModalOpen} onOpenChange={setExportModalOpen} />
    </div>
  );
}
