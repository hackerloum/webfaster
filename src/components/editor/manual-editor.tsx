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
                <label className="block text-sm font-medium mb-2 text-white">Background Image URL</label>
                <input
                  type="text"
                  value={editedContent.backgroundImage || editedContent.image || ''}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, backgroundImage: e.target.value, image: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40"
                  placeholder="https://images.unsplash.com/..."
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

          {section.type === 'about' && (
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
                <label className="block text-sm font-medium mb-2 text-white">Description</label>
                <textarea
                  value={editedContent.description || editedContent.text || ''}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, description: e.target.value, text: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Image URL</label>
                <input
                  type="text"
                  value={editedContent.image || ''}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, image: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Image Alt Text</label>
                <input
                  type="text"
                  value={editedContent.imageAlt || editedContent.alt || ''}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, imageAlt: e.target.value, alt: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40"
                  placeholder="About us image"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Mission (Optional)</label>
                <textarea
                  value={editedContent.mission || ''}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, mission: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40 resize-none"
                  placeholder="Our mission statement..."
                />
              </div>
            </>
          )}

          {section.type === 'features' && (
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
            </>
          )}

          {section.type === 'contact' && (
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
                  rows={2}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Email</label>
                <input
                  type="email"
                  value={editedContent.email || ''}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Phone</label>
                <input
                  type="tel"
                  value={editedContent.phone || ''}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Address</label>
                <textarea
                  value={editedContent.address || ''}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, address: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Business Hours</label>
                <input
                  type="text"
                  value={editedContent.hours || ''}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, hours: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40"
                  placeholder="Monday - Friday: 9:00 AM - 6:00 PM"
                />
              </div>
            </>
          )}

          {section.type === 'footer' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Company Name</label>
                <input
                  type="text"
                  value={editedContent.companyName || editedContent.name || ''}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, companyName: e.target.value, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Description</label>
                <textarea
                  value={editedContent.description || editedContent.text || ''}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, description: e.target.value, text: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Copyright Text</label>
                <input
                  type="text"
                  value={editedContent.copyright || `© ${new Date().getFullYear()} All rights reserved.`}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, copyright: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40"
                />
              </div>
            </>
          )}

          {section.type === 'cta' && (
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
                  value={editedContent.subheading || editedContent.text || ''}
                  onChange={(e) =>
                    setEditedContent({ ...editedContent, subheading: e.target.value, text: e.target.value })
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

          {section.type === 'services' && (
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
                  rows={2}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Services (JSON)</label>
                <textarea
                  value={JSON.stringify(editedContent.services || editedContent.items || [], null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setEditedContent({ ...editedContent, services: parsed, items: parsed });
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  rows={8}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 font-mono text-xs text-white"
                />
              </div>
            </>
          )}

          {section.type === 'pricing' && (
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
                  rows={2}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Plans (JSON)</label>
                <textarea
                  value={JSON.stringify(editedContent.plans || editedContent.pricing || editedContent.items || [], null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setEditedContent({ ...editedContent, plans: parsed, pricing: parsed, items: parsed });
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  rows={10}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 font-mono text-xs text-white"
                />
              </div>
            </>
          )}

          {section.type === 'testimonials' && (
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
              
              {/* Testimonials List Editor */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-white">Testimonials</label>
                  <button
                    type="button"
                    onClick={() => {
                      const testimonials = editedContent.testimonials || editedContent.items || [];
                      const newTestimonial = {
                        name: '',
                        role: '',
                        avatar: '',
                        rating: 5,
                        text: '',
                      };
                      setEditedContent({
                        ...editedContent,
                        testimonials: [...testimonials, newTestimonial],
                        items: [...testimonials, newTestimonial],
                      });
                    }}
                    className="px-3 py-1.5 bg-purple-500/20 text-purple-300 text-xs rounded-md hover:bg-purple-500/30 transition-colors"
                  >
                    + Add Testimonial
                  </button>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  {((editedContent.testimonials || editedContent.items || []) as any[]).map((testimonial: any, index: number) => {
                    const testimonials = editedContent.testimonials || editedContent.items || [];
                    return (
                      <div key={index} className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-white/60 font-medium">Testimonial #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newTestimonials = testimonials.filter((_: any, i: number) => i !== index);
                              setEditedContent({
                                ...editedContent,
                                testimonials: newTestimonials,
                                items: newTestimonials,
                              });
                            }}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-white/70 mb-1">Name</label>
                          <input
                            type="text"
                            value={testimonial.name || ''}
                            onChange={(e) => {
                              const newTestimonials = [...testimonials];
                              newTestimonials[index] = { ...testimonial, name: e.target.value };
                              setEditedContent({
                                ...editedContent,
                                testimonials: newTestimonials,
                                items: newTestimonials,
                              });
                            }}
                            className="w-full px-2 py-1.5 bg-white/5 border border-white/20 rounded text-sm text-white placeholder:text-white/30"
                            placeholder="John Doe"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs text-white/70 mb-1">Role/Title</label>
                          <input
                            type="text"
                            value={testimonial.role || testimonial.title || ''}
                            onChange={(e) => {
                              const newTestimonials = [...testimonials];
                              newTestimonials[index] = { ...testimonial, role: e.target.value, title: e.target.value };
                              setEditedContent({
                                ...editedContent,
                                testimonials: newTestimonials,
                                items: newTestimonials,
                              });
                            }}
                            className="w-full px-2 py-1.5 bg-white/5 border border-white/20 rounded text-sm text-white placeholder:text-white/30"
                            placeholder="CEO, Company Name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs text-white/70 mb-1">Avatar Image URL</label>
                          <input
                            type="text"
                            value={testimonial.avatar || testimonial.image || ''}
                            onChange={(e) => {
                              const newTestimonials = [...testimonials];
                              newTestimonials[index] = { ...testimonial, avatar: e.target.value, image: e.target.value };
                              setEditedContent({
                                ...editedContent,
                                testimonials: newTestimonials,
                                items: newTestimonials,
                              });
                            }}
                            className="w-full px-2 py-1.5 bg-white/5 border border-white/20 rounded text-sm text-white placeholder:text-white/30"
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs text-white/70 mb-1">Rating (1-5)</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={testimonial.rating || 5}
                            onChange={(e) => {
                              const newTestimonials = [...testimonials];
                              newTestimonials[index] = { ...testimonial, rating: parseInt(e.target.value) || 5 };
                              setEditedContent({
                                ...editedContent,
                                testimonials: newTestimonials,
                                items: newTestimonials,
                              });
                            }}
                            className="w-full px-2 py-1.5 bg-white/5 border border-white/20 rounded text-sm text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs text-white/70 mb-1">Quote/Testimonial Text</label>
                          <textarea
                            value={testimonial.text || testimonial.quote || testimonial.content || ''}
                            onChange={(e) => {
                              const newTestimonials = [...testimonials];
                              newTestimonials[index] = { ...testimonial, text: e.target.value, quote: e.target.value, content: e.target.value };
                              setEditedContent({
                                ...editedContent,
                                testimonials: newTestimonials,
                                items: newTestimonials,
                              });
                            }}
                            rows={3}
                            className="w-full px-2 py-1.5 bg-white/5 border border-white/20 rounded text-sm text-white placeholder:text-white/30 resize-none"
                            placeholder="What they said..."
                          />
                        </div>
                      </div>
                    );
                  })}
                  
                  {((editedContent.testimonials || editedContent.items || []) as any[]).length === 0 && (
                    <div className="text-center py-8 text-white/40 text-sm">
                      No testimonials yet. Click &quot;Add Testimonial&quot; to add one.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {section.type === 'team' && (
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
                  rows={2}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder:text-white/40 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Team Members (JSON)</label>
                <textarea
                  value={JSON.stringify(editedContent.members || editedContent.team || editedContent.items || [], null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setEditedContent({ ...editedContent, members: parsed, team: parsed, items: parsed });
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  rows={10}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 font-mono text-xs text-white"
                />
              </div>
            </>
          )}

          {section.type === 'gallery' && (
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
                <label className="block text-sm font-medium mb-2 text-white">Images (JSON array of URLs)</label>
                <textarea
                  value={JSON.stringify(editedContent.images || editedContent.items || [], null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setEditedContent({ ...editedContent, images: parsed, items: parsed });
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  rows={8}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 font-mono text-xs text-white"
                />
              </div>
            </>
          )}

          {/* Generic content editor for custom types */}
          {!['hero', 'about', 'features', 'contact', 'footer', 'cta', 'services', 'pricing', 'testimonials', 'team', 'gallery'].includes(section.type) && (
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
