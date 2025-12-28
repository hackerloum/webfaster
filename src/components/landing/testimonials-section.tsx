'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Founder, TechStart',
    content: 'This platform transformed how we build client websites. What used to take weeks now takes minutes, and the quality is exceptional.',
    rating: 5,
  },
  {
    name: 'Michael Rodriguez',
    role: 'Creative Director, DesignCo',
    content: 'The AI understands design principles better than I expected. The generated websites are professional and require minimal tweaking.',
    rating: 5,
  },
  {
    name: 'Emily Johnson',
    role: 'Marketing Lead, GrowthHub',
    content: 'We\'ve built over 20 landing pages using this tool. The export feature is flawless, and the code quality is production-ready.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-slate-900 text-white scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Loved by Teams Worldwide</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Join thousands of professionals who are building better websites faster.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-700" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">{testimonial.content}</p>
              <div>
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-sm text-slate-400">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
