'use client';

import { motion } from 'framer-motion';
import { FileText, Sparkles, Edit, Rocket } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: FileText,
    title: 'Describe Your Vision',
    description: 'Tell us what kind of website you want to create. Be as detailed or as simple as you like.',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI Generates Your Site',
    description: 'Our advanced AI creates a complete, professional website structure in seconds.',
  },
  {
    number: '03',
    icon: Edit,
    title: 'Customize & Refine',
    description: 'Edit any section manually or use AI to make changes. Perfect every detail to match your brand.',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Export & Launch',
    description: 'Download your website code or deploy directly. Your site is ready to go live.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-slate-50 to-white scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Building a professional website has never been easier. Follow these simple steps to get started.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 -z-10" />
                  )}

                  <div className="relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.number}
                    </div>
                    <div className="mb-4">
                      <div className="inline-flex p-3 bg-blue-50 rounded-xl">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
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
