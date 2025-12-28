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
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" onClick={onToggleNavigator}>
          <Menu className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {currentWebsite?.metadata.title || 'Untitled Project'}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={undo}
          disabled={!canUndo()}
          leftIcon={<Undo className="w-4 h-4" />}
        >
          Undo
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={redo}
          disabled={!canRedo()}
          leftIcon={<Redo className="w-4 h-4" />}
        >
          Redo
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleSave}
          disabled={isSaving || !currentWebsite}
          leftIcon={<Save className="w-4 h-4" />}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Button
          size="sm"
          variant="default"
          onClick={() => setExportModalOpen(true)}
          disabled={!currentWebsite}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export
        </Button>
      </div>

      <ExportModal open={exportModalOpen} onOpenChange={setExportModalOpen} />
    </div>
  );
}
