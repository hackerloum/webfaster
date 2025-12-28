'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage } from '@/components/landing/landing-page';
import { GeneratorInterface } from '@/components/generator/generator-interface';
import { useWebsiteStore } from '@/store/website-store';
import { useGenerationStore } from '@/store/generation-store';
import { toast } from 'react-hot-toast';

export default function HomePage() {
  const router = useRouter();
  const setWebsite = useWebsiteStore((state) => state.setWebsite);
  const { setGenerating, setProgress, setError } = useGenerationStore();
  const [showGenerator, setShowGenerator] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if we should show generator from URL params (client-side only)
  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    if (params.get('generate') === 'true') {
      setShowGenerator(true);
    }
  }, []);

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

      // Call the API route instead of using AIService directly
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate website');
      }

      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to generate website');
      }

      const website = result.data.website;

      setProgress({ step: 3, totalSteps: 4, currentStep: 'Designing sections...' });
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProgress({ step: 4, totalSteps: 4, currentStep: 'Saving project...' });

      // Save project to database
      try {
        const saveResponse = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: website.title || 'Untitled Project',
            description: website.description || null,
            data: website,
          }),
        });

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json();
          // If unauthorized, redirect to login
          if (saveResponse.status === 401) {
            toast.error('Please log in to save your project');
            router.push('/login');
            return;
          }
          throw new Error(errorData.error?.message || 'Failed to save project');
        }

        const saveResult = await saveResponse.json();
        if (!saveResult.success) {
          throw new Error(saveResult.error?.message || 'Failed to save project');
        }

        const savedProject = saveResult.data;
        setWebsite(website);
        toast.success('Website generated and saved successfully!');

        // Navigate to editor with the saved project ID
        router.push(`/editor/${savedProject.id}`);
      } catch (saveError) {
        console.error('Save error:', saveError);
        // Even if save fails, allow user to view the generated website
        setWebsite(website);
        toast.error('Website generated but failed to save. Please log in to save.');
        // Still navigate to editor, but with the generated ID (will be lost on refresh if not saved)
        router.push(`/editor/${website.id}`);
      }
    } catch (error) {
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate website');
      toast.error('Failed to generate website. Please try again.');
    } finally {
      setGenerating(false);
      setProgress(null);
    }
  };

  // Prevent hydration mismatch by showing landing page on server
  if (!mounted) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <>
      {!showGenerator ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        <GeneratorInterface onGenerate={handleGenerate} />
      )}
    </>
  );
}
