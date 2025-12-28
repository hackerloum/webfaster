'use client';

import { useState } from 'react';
import { Section } from '@/lib/types/website';
import { useWebsiteStore } from '@/store/website-store';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ManualEditorProps {
  section: Section;
}

export function ManualEditor({ section }: ManualEditorProps) {
  const updateSection = useWebsiteStore((state) => state.updateSection);
  const [editedContent, setEditedContent] = useState(section.content);
  const [editedStyles, setEditedStyles] = useState(section.styles);

  const handleSave = () => {
    updateSection(section.id, {
      content: editedContent,
      styles: editedStyles,
    });
    toast.success('Section updated successfully');
  };

  return (
    <div className="p-4 space-y-4">
      <Tabs defaultValue="content">
        <TabsList className="w-full">
          <TabsTrigger value="content" className="flex-1">
            Content
          </TabsTrigger>
          <TabsTrigger value="styles" className="flex-1">
            Styles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
          {/* Dynamic content editing based on section type */}
          {section.type === 'hero' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Heading</label>
                <input
                  type="text"
                  value={editedContent.heading || ''}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, heading: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subheading</label>
                <textarea
                  value={editedContent.subheading || ''}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, subheading: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">CTA Text</label>
                <input
                  type="text"
                  value={editedContent.ctaText || ''}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, ctaText: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">CTA Link</label>
                <input
                  type="text"
                  value={editedContent.ctaLink || '#'}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, ctaLink: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </>
          )}

          {section.type === 'features' && (
            <div>
              <label className="block text-sm font-medium mb-2">Features (JSON)</label>
              <textarea
                value={JSON.stringify(editedContent.features || [], null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setEditedContent({ ...editedContent, features: parsed });
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                rows={10}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
              />
            </div>
          )}

          {/* Generic content editor for other types */}
          {!['hero', 'features'].includes(section.type) && (
            <div>
              <label className="block text-sm font-medium mb-2">Content (JSON)</label>
              <textarea
                value={JSON.stringify(editedContent, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setEditedContent(parsed);
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                rows={10}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="styles" className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-2">Background Color</label>
            <input
              type="color"
              value={editedStyles.backgroundColor || '#ffffff'}
              onChange={(e) =>
                setEditedStyles({ ...editedStyles, backgroundColor: e.target.value })
              }
              className="w-full h-10 border border-gray-200 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Text Color</label>
            <input
              type="color"
              value={editedStyles.textColor || '#000000'}
              onChange={(e) =>
                setEditedStyles({ ...editedStyles, textColor: e.target.value })
              }
              className="w-full h-10 border border-gray-200 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Custom CSS</label>
            <textarea
              value={editedStyles.customCSS || ''}
              onChange={(e) =>
                setEditedStyles({ ...editedStyles, customCSS: e.target.value })
              }
              rows={5}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
              placeholder="/* Custom CSS */"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="pt-4 border-t">
        <Button onClick={handleSave} className="w-full" leftIcon={<Save className="w-4 h-4" />}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
