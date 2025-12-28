'use client';

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
      <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">
        Or try an example:
      </h3>
      <div className="grid md:grid-cols-2 gap-3">
        {EXAMPLES.map((example, idx) => (
          <button
            key={idx}
            onClick={() => onExampleClick(example)}
            className="p-4 text-left text-sm bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
