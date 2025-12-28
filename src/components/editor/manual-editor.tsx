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
    <div className="p-4 md:p-6 space-y-4">
      <Tabs defaultValue="content">
        <TabsList className="w-full bg-white/5 border border-white/10">
          <TabsTrigger 
            value="content" 
            className="flex-1 text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10"
          >
            Content
          </TabsTrigger>
          <TabsTrigger 
            value="styles"
            className="flex-1 text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10"
          >
            Styles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
          {/* Dynamic content editing based on section type */}
          {section.type === 'hero' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Heading</label>
                <input
                  type="text"
                  value={editedContent.heading || ''}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, heading: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Subheading</label>
                <textarea
                  value={editedContent.subheading || ''}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, subheading: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">CTA Text</label>
                <input
                  type="text"
                  value={editedContent.ctaText || ''}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, ctaText: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">CTA Link</label>
                <input
                  type="text"
                  value={editedContent.ctaLink || '#'}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, ctaLink: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40"
                />
              </div>
            </>
          )}

          {section.type === 'features' && (
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Features (JSON)</label>
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
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 font-mono text-xs text-white"
              />
            </div>
          )}

          {/* Generic content editor for other types */}
          {!['hero', 'features'].includes(section.type) && (
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Content (JSON)</label>
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
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 font-mono text-xs text-white"
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="styles" className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Background Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={editedStyles.backgroundColor || '#ffffff'}
                onChange={(e) =>
                  setEditedStyles({ ...editedStyles, backgroundColor: e.target.value })
                }
                className="w-16 h-10 border border-white/20 rounded-md cursor-pointer"
              />
              <input
                type="text"
                value={editedStyles.backgroundColor || '#ffffff'}
                onChange={(e) =>
                  setEditedStyles({ ...editedStyles, backgroundColor: e.target.value })
                }
                className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white font-mono text-sm"
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">Text Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={editedStyles.textColor || '#000000'}
                onChange={(e) =>
                  setEditedStyles({ ...editedStyles, textColor: e.target.value })
                }
                className="w-16 h-10 border border-white/20 rounded-md cursor-pointer"
              />
              <input
                type="text"
                value={editedStyles.textColor || '#000000'}
                onChange={(e) =>
                  setEditedStyles({ ...editedStyles, textColor: e.target.value })
                }
                className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white font-mono text-sm"
                placeholder="#000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">Padding</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-white/60 mb-1">Top</label>
                <input
                  type="text"
                  value={editedStyles.padding?.top || '0'}
                  onChange={(e) =>
                    setEditedStyles({
                      ...editedStyles,
                      padding: { ...editedStyles.padding, top: e.target.value } as any,
                    })
                  }
                  className="w-full px-2 py-1.5 bg-white/5 border border-white/20 rounded text-white text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1">Right</label>
                <input
                  type="text"
                  value={editedStyles.padding?.right || '0'}
                  onChange={(e) =>
                    setEditedStyles({
                      ...editedStyles,
                      padding: { ...editedStyles.padding, right: e.target.value } as any,
                    })
                  }
                  className="w-full px-2 py-1.5 bg-white/5 border border-white/20 rounded text-white text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1">Bottom</label>
                <input
                  type="text"
                  value={editedStyles.padding?.bottom || '0'}
                  onChange={(e) =>
                    setEditedStyles({
                      ...editedStyles,
                      padding: { ...editedStyles.padding, bottom: e.target.value } as any,
                    })
                  }
                  className="w-full px-2 py-1.5 bg-white/5 border border-white/20 rounded text-white text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1">Left</label>
                <input
                  type="text"
                  value={editedStyles.padding?.left || '0'}
                  onChange={(e) =>
                    setEditedStyles({
                      ...editedStyles,
                      padding: { ...editedStyles.padding, left: e.target.value } as any,
                    })
                  }
                  className="w-full px-2 py-1.5 bg-white/5 border border-white/20 rounded text-white text-sm"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">Border Radius</label>
            <input
              type="text"
              value={editedStyles.borderRadius || ''}
              onChange={(e) =>
                setEditedStyles({ ...editedStyles, borderRadius: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40"
              placeholder="0.5rem"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">Custom CSS</label>
            <textarea
              value={editedStyles.customCSS || ''}
              onChange={(e) =>
                setEditedStyles({ ...editedStyles, customCSS: e.target.value })
              }
              rows={5}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 font-mono text-xs text-white placeholder:text-white/40"
              placeholder="/* Custom CSS */"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="pt-4 border-t border-white/10">
        <Button 
          onClick={handleSave} 
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/20" 
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
