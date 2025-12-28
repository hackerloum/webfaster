'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage } from '@/components/landing/landing-page';
import { GeneratorInterface } from '@/components/generator/generator-interface';
import { useWebsiteStore } from '@/store/website-store';
import { useGenerationStore } from '@/store/generation-store';
import { AIService } from '@/lib/services/ai-service';
import { toast } from 'react-hot-toast';

export default function HomePage() {
  const router = useRouter();
  const setWebsite = useWebsiteStore((state) => state.setWebsite);
  const { setGenerating, setProgress, setError } = useGenerationStore();
  const [showGenerator, setShowGenerator] = useState(false);

  const handleGetStarted = () => {
    setShowGenerator(true);
    // Scroll to generator
    setTimeout(() => {
      const element = document.getElementById('generator');
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleGenerate = async (userPrompt: string) => {
    if (!userPrompt.trim()) {
      toast.error('Please enter a description for your website');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      // Simulate progress
      setProgress({ step: 1, totalSteps: 4, currentStep: 'Analyzing your prompt...' });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProgress({ step: 2, totalSteps: 4, currentStep: 'Creating website structure...' });

      const aiService = new AIService();
      const website = await aiService.generateWebsite(userPrompt);

      setProgress({ step: 3, totalSteps: 4, currentStep: 'Designing sections...' });
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProgress({ step: 4, totalSteps: 4, currentStep: 'Finalizing...' });
      await new Promise((resolve) => setTimeout(resolve, 500));

      setWebsite(website);
      toast.success('Website generated successfully!');

      // Navigate to editor
      router.push(`/editor/${website.id}`);
    } catch (error) {
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate website');
      toast.error('Failed to generate website. Please try again.');
    } finally {
      setGenerating(false);
      setProgress(null);
    }
  };

  return (
    <>
      {!showGenerator ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div id="generator" className="pt-20">
            <GeneratorInterface onGenerate={handleGenerate} />
          </div>
        </div>
      )}
    </>
  );
}
