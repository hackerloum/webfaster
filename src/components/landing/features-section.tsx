'use client';

import { motion } from 'framer-motion';
import { Code2, Wand2, Zap, Palette, Download, Shield, Sparkles, GitBranch, Layers } from 'lucide-react';

const features = [
  {
    icon: Wand2,
    title: 'AI-Powered Generation',
    description: 'Advanced GPT-4 integration that understands context, design principles, and brand guidelines.',
    gradient: 'from-blue-500/20 to-blue-600/20',
    iconGradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: Code2,
    title: 'Production Code',
    description: 'Clean, semantic, accessible HTML/CSS/JS. Ready to deploy without modification.',
    gradient: 'from-purple-500/20 to-purple-600/20',
    iconGradient: 'from-purple-500 to-purple-600',
  },
  {
    icon: Layers,
    title: 'Component System',
    description: 'Modular architecture with reusable components. Edit once, update everywhere instantly.',
    gradient: 'from-cyan-500/20 to-cyan-600/20',
    iconGradient: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: Sparkles,
    title: 'Smart Refinement',
    description: 'AI assistant that learns preferences. Click any element and describe changes naturally.',
    gradient: 'from-pink-500/20 to-pink-600/20',
    iconGradient: 'from-pink-500 to-pink-600',
  },
  {
    icon: GitBranch,
    title: 'Version Control',
    description: 'Complete history with unlimited undo. Branch designs, test variations, merge winners.',
    gradient: 'from-emerald-500/20 to-emerald-600/20',
    iconGradient: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 compliant with end-to-end encryption. Your designs, your IP, your control.',
    gradient: 'from-orange-500/20 to-orange-600/20',
    iconGradient: 'from-orange-500 to-orange-600',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 bg-[#0A0A0F] overflow-hidden scroll-mt-20">
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
            <span className="block text-white mb-2">Enterprise Features.</span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Zero Compromise.
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            Professional tools designed for teams that ship fast without sacrificing quality.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative h-full p-8 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.iconGradient} mb-6`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">{feature.description}</p>

                  {/* Hover Glow */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
