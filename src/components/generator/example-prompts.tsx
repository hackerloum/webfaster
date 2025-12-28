'use client';

import { ArrowRight } from 'lucide-react';

const EXAMPLES = [
  'A modern portfolio website for a photographer with gallery, about, and contact sections',
  'A landing page for a mobile app with features, testimonials, and download buttons',
  'An e-commerce product page with hero image, specifications, and reviews',
  'A restaurant website with menu, location, and online ordering',
];

interface ExamplePromptsProps {
  onExampleClick: (prompt: string) => void;
}

export function ExamplePrompts({ onExampleClick }: ExamplePromptsProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-white/60 mb-4 text-center">
        Or try an example:
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {EXAMPLES.map((example, idx) => (
          <button
            key={idx}
            onClick={() => onExampleClick(example)}
            className="group p-4 sm:p-5 text-left text-sm sm:text-base bg-white/[0.02] border border-white/[0.08] rounded-xl hover:border-purple-400/50 hover:bg-white/[0.04] transition-all text-white/80 hover:text-white"
          >
            <div className="flex items-start justify-between gap-3">
              <span>{example}</span>
              <ArrowRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
