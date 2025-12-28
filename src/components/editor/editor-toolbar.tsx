'use client';

import { useState } from 'react';
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
  const currentWebsite = useWebsiteStore((state) => state.currentWebsite);
  const { undo, redo, canUndo, canRedo } = useWebsiteStore();
  const { isSaving, setSaving } = useEditorStore();
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const handleSave = async () => {
    if (!currentWebsite) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${currentWebsite.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentWebsite),
      });

      if (!response.ok) throw new Error('Failed to save');
      toast.success('Project saved successfully');
    } catch (error) {
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-[#111118] border-b border-white/10 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onToggleNavigator}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="h-6 w-px bg-white/10" />
        <h2 className="text-lg font-semibold text-white">
          {currentWebsite?.metadata.title || 'Untitled Project'}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={undo}
          disabled={!canUndo()}
          className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
          leftIcon={<Undo className="w-4 h-4" />}
        >
          Undo
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={redo}
          disabled={!canRedo()}
          className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
          leftIcon={<Redo className="w-4 h-4" />}
        >
          Redo
        </Button>
        <div className="h-6 w-px bg-white/10 mx-1" />
        <Button
          size="sm"
          variant="outline"
          onClick={handleSave}
          disabled={isSaving || !currentWebsite}
          className="bg-white/5 text-white border-white/20 hover:bg-white/10 disabled:opacity-30"
          leftIcon={<Save className="w-4 h-4" />}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Button
          size="sm"
          variant="default"
          onClick={() => setExportModalOpen(true)}
          disabled={!currentWebsite}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 disabled:opacity-30 shadow-lg shadow-purple-500/20"
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export
        </Button>
      </div>

      <ExportModal open={exportModalOpen} onOpenChange={setExportModalOpen} />
    </div>
  );
}
