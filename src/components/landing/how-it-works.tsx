'use client';

import { motion } from 'framer-motion';
import { FileText, Sparkles, Edit3, Rocket } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: FileText,
    title: 'Describe',
    description: 'Tell us what you want. Natural language processing understands your vision.',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Generate',
    description: 'AI creates semantic structure, responsive layouts, and production code.',
  },
  {
    number: '03',
    icon: Edit3,
    title: 'Refine',
    description: 'Visual editor with AI assistance. Change anything with natural commands.',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Deploy',
    description: 'Export clean code or deploy instantly. Production-ready from the start.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 bg-[#0A0A0F] overflow-hidden scroll-mt-20">
      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            <span className="block text-white mb-2">Simple Process.</span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Powerful Results.
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            From idea to production in four steps. No complexity, just results.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group"
                >
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-px z-0">
                      <div className="h-full bg-gradient-to-r from-white/10 via-blue-400/30 to-white/10" />
                    </div>
                  )}

                  <div className="relative h-full p-8 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300">
                    {/* Number Badge */}
                    <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">{step.number}</span>
                    </div>

                    {/* Icon */}
                    <div className="mb-6 mt-4">
                      <div className="inline-flex p-3 rounded-xl bg-white/[0.05]">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-white/60 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
