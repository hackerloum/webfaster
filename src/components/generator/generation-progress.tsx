'use client';

import { GenerationProgress as ProgressType } from '@/lib/types/editor';
import { Loader2 } from 'lucide-react';

interface GenerationProgressProps {
  progress: ProgressType | null;
}

export function GenerationProgress({ progress }: GenerationProgressProps) {
  if (!progress) return null;

  const percentage = (progress.step / progress.totalSteps) * 100;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100 animate-slide-up">
      <div className="text-center mb-8">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <h3 className="text-2xl font-semibold mb-2">Creating Your Website</h3>
        <p className="text-muted-foreground">{progress.currentStep}</p>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between text-sm">
        {Array.from({ length: progress.totalSteps }, (_, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center ${
              idx + 1 <= progress.step ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                idx + 1 <= progress.step
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {idx + 1}
            </div>
            <span className="text-xs">Step {idx + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
