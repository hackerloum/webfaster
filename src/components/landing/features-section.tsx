'use client';

import { motion } from 'framer-motion';
import { Code, Wand2, Zap, Palette, Download, Shield } from 'lucide-react';

const features = [
  {
    icon: Wand2,
    title: 'AI-Powered Generation',
    description: 'Describe your website in natural language and watch our AI create a complete, professional design in seconds.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Code,
    title: 'Full Code Control',
    description: 'Access and edit the generated HTML, CSS, and JavaScript. Export clean, production-ready code.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Palette,
    title: 'Customizable Design',
    description: 'Fine-tune every aspect of your website with our intuitive editor. Change colors, fonts, layouts, and more.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate complete websites in under a minute. No waiting, no delays—just instant results.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Download,
    title: 'Export & Deploy',
    description: 'Download your website as a ZIP file or deploy directly to your hosting provider with one click.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Shield,
    title: 'Enterprise Ready',
    description: 'Built with security and scalability in mind. Perfect for businesses of all sizes.',
    color: 'from-indigo-500 to-blue-500',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Everything You Need to Build
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Exceptional Websites
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful features designed to help you create, customize, and deploy professional websites effortlessly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-8 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all hover:shadow-xl"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
