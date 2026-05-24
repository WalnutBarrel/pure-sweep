"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Container from "./Container";

const testimonials = [
  {
    quote: "PureSweep has cleaned our commercial offices in central Auckland for the past year. Their workmanship is consistent, and the supervisors are always responsive to our schedule requirements.",
    author: "Richard Hadlee",
    role: "Director, Apex Legal",
    location: "Ponsonby, Auckland",
  },
  {
    quote: "The deep clean team did an exceptional job restoring the marble benchtops and oven in our newly renovated home. Very thorough, professional, and trustworthy operators.",
    author: "Grace Thompson",
    role: "Homeowner",
    location: "Remuera, Auckland",
  },
  {
    quote: "Excellent residential cleaning standard. The pricing estimator made booking straightforward, and the team arrived exactly on time. Highly recommended for Auckland busy professionals.",
    author: "David Lomas",
    role: "Property Manager",
    location: "Epsom, Auckland",
  },
];

export default function TestimonialsSlider() {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  const current = testimonials[index];

  return (
    <section className="bg-surface border-y border-border py-20 font-sans">
      <Container className="max-w-4xl">
        <div
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className="text-center space-y-8 relative outline-none focus:ring-1 focus:ring-accent py-4 animate-enter-fade"
          aria-label="Client Reviews Slider. Use Arrow keys to navigate."
        >
          <Quote className="h-10 w-10 text-accent/30 mx-auto" />

          {/* Active Testimonial Crossfade */}
          <div className="min-h-[140px] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeInOut" }}
                className="space-y-4"
              >
                <blockquote className="font-serif text-lg md:text-xl lg:text-2xl text-primary leading-relaxed font-light italic px-6 md:px-12">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-stone-800">{current.role}</p>
                  <p className="text-xs text-muted-text">
                    <span className="text-accent font-medium">{current.location}</span>
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-6 pt-4">
            <button
              onClick={prevSlide}
              className="p-2 border border-border hover:border-primary text-stone-600 hover:text-primary transition-colors cursor-pointer select-none outline-none focus:ring-1 focus:ring-accent"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-[11px] font-mono text-muted-text">
              {index + 1} / {testimonials.length}
            </div>
            <button
              onClick={nextSlide}
              className="p-2 border border-border hover:border-primary text-stone-600 hover:text-primary transition-colors cursor-pointer select-none outline-none focus:ring-1 focus:ring-accent"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
