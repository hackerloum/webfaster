'use client';

import { useState } from 'react';
import { Section } from '@/lib/types/website';
import { useWebsiteStore } from '@/store/website-store';
import { useEditorStore } from '@/store/editor-store';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AIService } from '@/lib/services/ai-service';

interface AIEditorProps {
  section: Section;
}

export function AIEditor({ section }: AIEditorProps) {
  const updateSection = useWebsiteStore((state) => state.updateSection);
  const setGenerating = useEditorStore((state) => state.setGenerating);
  const isGenerating = useEditorStore((state) => state.isGenerating);
  const [instruction, setInstruction] = useState('');

  const handleModify = async () => {
    if (!instruction.trim()) {
      toast.error('Please enter an instruction');
      return;
    }

    setGenerating(true);
    try {
      const aiService = new AIService();
      const modifiedSection = await aiService.modifySection(section, instruction);
      updateSection(section.id, modifiedSection);
      toast.success('Section modified successfully!');
      setInstruction('');
    } catch (error) {
      console.error('AI modification error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to modify section');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Describe the changes you want:</h4>
        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Example: Make the heading larger and change the background to a gradient"
          rows={6}
          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          disabled={isGenerating}
        />
      </div>

      <Button
        onClick={handleModify}
        className="w-full"
        disabled={!instruction.trim() || isGenerating}
        leftIcon={isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
      >
        {isGenerating ? 'Modifying...' : 'Apply AI Changes'}
      </Button>

      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          The AI will modify this section based on your instruction. Changes will be applied immediately.
        </p>
      </div>
    </div>
  );
}
