'use client';

import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

type ProgressType = {
  step: number;
  totalSteps: number;
  currentStep: string;
};

interface GenerationProgressProps {
  progress: ProgressType | null;
}

export function GenerationProgress({ progress }: GenerationProgressProps) {
  if (!progress) return null;

  const percentage = (progress.step / progress.totalSteps) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto p-8 sm:p-10 bg-white/[0.02] border border-white/[0.05] rounded-2xl sm:rounded-3xl backdrop-blur-xl"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Creating Your Website</h3>
        <p className="text-lg text-white/60">{progress.currentStep}</p>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 sm:h-3 bg-white/[0.05] rounded-full overflow-hidden mb-8">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between text-sm">
        {Array.from({ length: progress.totalSteps }, (_, idx) => {
          const isCompleted = idx + 1 <= progress.step;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className={`flex flex-col items-center ${isCompleted ? 'text-purple-400' : 'text-white/40'}`}
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-2 text-sm font-semibold transition-all ${
                  isCompleted
                    ? 'bg-gradient-to-br from-purple-400 to-blue-400 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-white/[0.05] border border-white/[0.08]'
                }`}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <span className="text-xs">Step {idx + 1}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
