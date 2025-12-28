'use client';

import { useState } from 'react';
import { Section } from '@/lib/types/website';
import { useWebsiteStore } from '@/store/website-store';
import { useEditorStore } from '@/store/editor-store';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
      console.log('Sending modification request:', { sectionId: section.id, instruction });
      
      // Call the API route instead of using AIService directly
      const response = await fetch('/api/ai/modify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, instruction }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `Server error: ${response.status}`;
        console.error('API error:', errorData);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Modification result:', result);
      
      if (!result.success || !result.data) {
        const errorMessage = result.error?.message || 'Failed to modify section';
        console.error('Modification failed:', result);
        throw new Error(errorMessage);
      }

      const modifiedSection = result.data.section;
      
      // Validate the modified section has required fields
      if (!modifiedSection || !modifiedSection.content || !modifiedSection.styles) {
        console.error('Invalid modified section:', modifiedSection);
        throw new Error('Invalid section structure returned from AI');
      }

      // Ensure the section ID matches
      if (modifiedSection.id !== section.id) {
        console.warn('Section ID mismatch, correcting...', { 
          original: section.id, 
          returned: modifiedSection.id 
        });
        modifiedSection.id = section.id;
      }

      console.log('Updating section:', { 
        sectionId: section.id, 
        modifiedContent: modifiedSection.content,
        modifiedStyles: modifiedSection.styles 
      });

      // Update the section with the modified data
      updateSection(section.id, {
        content: modifiedSection.content,
        styles: modifiedSection.styles,
        visible: modifiedSection.visible !== undefined ? modifiedSection.visible : section.visible,
        metadata: modifiedSection.metadata || section.metadata,
      });

      toast.success('Section modified successfully!');
      setInstruction('');
      
      // Force a small delay to ensure state updates
      setTimeout(() => {
        console.log('Section update completed');
      }, 100);
    } catch (error) {
      console.error('AI modification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to modify section';
      toast.error(errorMessage);
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
