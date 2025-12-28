'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Wand2, ArrowRight, Zap, TrendingUp } from 'lucide-react';
import { useGenerationStore } from '@/store/generation-store';
import { GenerationProgress } from './generation-progress';
import { ExamplePrompts } from './example-prompts';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-purple-500/[0.12] rounded-full blur-[140px]" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-blue-500/[0.08] rounded-full blur-[140px]" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/[0.05] bg-[#0A0A0F]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/dashboard" className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold text-white">AI Website Builder</span>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="bg-white/[0.03] border-white/[0.08] text-white hover:bg-white/[0.06]"
                >
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12 sm:mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm font-medium mb-6 text-purple-400">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Website Builder</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                Describe Your Website,
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  We&apos;ll Build It
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed">
                Transform your ideas into beautiful, professional websites using the power of AI.
                Just describe what you want, and watch it come to life in seconds.
              </p>
            </motion.div>

            {/* Generation Interface */}
            {!isGenerating ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-8"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
                    <div className="relative">
                      <textarea
                        value={localPrompt}
                        onChange={(e) => setLocalPrompt(e.target.value)}
                        placeholder="Example: Create a modern landing page for a SaaS product with a hero section, features, pricing, and contact form. Use a blue and white color scheme."
                        className="w-full h-40 sm:h-48 px-6 py-4 text-base sm:text-lg bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none resize-none transition-all"
                        disabled={isGenerating}
                        maxLength={1000}
                      />
                      <div className="absolute bottom-4 right-4 text-sm text-white/40">
                        {localPrompt.length} / 1000
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={!localPrompt.trim() || isGenerating}
                    className="w-full bg-white text-black hover:bg-white/90 font-semibold h-14 sm:h-16 text-lg sm:text-xl"
                  >
                    <Wand2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                    Generate Website
                  </Button>
                </form>

                {/* Example Prompts */}
                <ExamplePrompts onExampleClick={handleExampleClick} />

                {/* Features */}
                <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16">
                  {[
                    {
                      icon: Zap,
                      title: 'Lightning Fast',
                      description: 'Generate complete websites in seconds',
                      color: 'from-yellow-400 to-orange-400',
                    },
                    {
                      icon: TrendingUp,
                      title: 'Production Ready',
                      description: 'Clean, semantic code ready to deploy',
                      color: 'from-green-400 to-emerald-400',
                    },
                    {
                      icon: Sparkles,
                      title: 'AI Powered',
                      description: 'Advanced AI creates beautiful designs',
                      color: 'from-purple-400 to-pink-400',
                    },
                  ].map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                      className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-xl sm:rounded-2xl hover:bg-white/[0.04] transition-all group"
                    >
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-white/60">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <GenerationProgress progress={progress} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
