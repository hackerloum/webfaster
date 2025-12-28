'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Wand2 } from 'lucide-react';
import { useGenerationStore } from '@/store/generation-store';
import { GenerationProgress } from './generation-progress';
import { ExamplePrompts } from './example-prompts';

interface GeneratorInterfaceProps {
  onGenerate: (prompt: string) => Promise<void>;
}

export function GeneratorInterface({ onGenerate }: GeneratorInterfaceProps) {
  const { prompt, setPrompt, isGenerating, progress } = useGenerationStore();
  const [localPrompt, setLocalPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localPrompt.trim()) {
      setPrompt(localPrompt);
      await onGenerate(localPrompt);
    }
  };

  const handleExampleClick = (examplePrompt: string) => {
    setLocalPrompt(examplePrompt);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Website Builder</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Describe Your Website,
            <br />
            We'll Build It
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your ideas into beautiful, professional websites using the power of AI.
            Just describe what you want, and watch it come to life.
          </p>
        </div>

        {/* Generation Interface */}
        {!isGenerating ? (
          <div className="space-y-8 animate-slide-up">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={localPrompt}
                  onChange={(e) => setLocalPrompt(e.target.value)}
                  placeholder="Example: Create a modern landing page for a SaaS product with a hero section, features, pricing, and contact form. Use a blue and white color scheme."
                  className="w-full h-40 px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none resize-none transition-all"
                  disabled={isGenerating}
                  maxLength={1000}
                />
                <div className="absolute bottom-4 right-4 text-sm text-muted-foreground">
                  {localPrompt.length} / 1000
                </div>
              </div>

              <Button
                type="submit"
                size="xl"
                className="w-full"
                disabled={!localPrompt.trim() || isGenerating}
                leftIcon={<Wand2 className="w-5 h-5" />}
              >
                Generate Website
              </Button>
            </form>

            {/* Example Prompts */}
            <ExamplePrompts onExampleClick={handleExampleClick} />
          </div>
        ) : (
          <GenerationProgress progress={progress} />
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            {
              icon: '🎨',
              title: 'AI-Powered Design',
              description: 'Beautiful, professional designs generated instantly',
            },
            {
              icon: '✏️',
              title: 'Easy Editing',
              description: 'Click any section to edit manually or with AI',
            },
            {
              icon: '🚀',
              title: 'Export & Deploy',
              description: 'Download code or deploy with one click',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
