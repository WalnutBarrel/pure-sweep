"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/images/hero_residential.png",
    subtitle: "Central & West Auckland Care",
    title: "PureSweep House Cleaning",
    description: "Consistent home cleaning standards, delivered with transparent hourly rates and meticulous workmanship.",
  },
  {
    image: "/images/hero_commercial.png",
    subtitle: "Professional Corporate Standards",
    title: "Premium Office Cleaning",
    description: "Impeccable meeting rooms and workspaces configured for Auckland's leading commercial offices.",
  },
  {
    image: "/images/hero_deep.png",
    subtitle: "Restorative Attention to Detail",
    title: "Specialized Deep Cleaning",
    description: "Deep sanitation and polishing for kitchen marble, brass fittings, and high-traffic flooring.",
  },
];

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  // Autoplay loop respecting hover state and reduced motion settings
  useEffect(() => {
    if (shouldReduceMotion || isHovered) {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      return;
    }

    autoplayTimer.current = setInterval(nextSlide, 7000);

    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [nextSlide, isHovered, shouldReduceMotion]);

  const slide = slides[activeIndex];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="relative w-full h-[650px] lg:h-[750px] bg-stone-900 overflow-hidden font-sans outline-none focus:ring-1 focus:ring-accent"
      aria-label="Editorial Clean Service Slider. Use Arrow keys to navigate slides."
      role="region"
    >
      {/* Background Images Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      </AnimatePresence>

      {/* Dark Muted Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent pointer-events-none" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12 w-full">
          <div className="max-w-2xl space-y-6 pointer-events-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: [0.23, 1, 0.32, 1] as const }}
                className="space-y-4"
              >
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent block">
                  {slide.subtitle}
                </span>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-[60px] leading-[1.1] text-white font-light tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-sm md:text-base text-[#D4CDC3] leading-relaxed max-w-lg font-light">
                  {slide.description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="pt-6 flex flex-row gap-4">
              <Link href="/book-a-cleaning" className="btn-accent px-8 text-xs font-bold">
                Book a Cleaning
              </Link>
              <Link href="/services" className="btn-outline border-[#D4CDC3] text-[#D4CDC3] hover:bg-white hover:text-stone-950 hover:border-white px-8 text-xs font-bold">
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Arrow Controls */}
      <div className="absolute bottom-10 left-10 flex space-x-4 z-10">
        <button
          onClick={prevSlide}
          className="p-3 border border-[#D4CDC3]/30 hover:border-white text-[#D4CDC3] hover:text-white transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-accent"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={nextSlide}
          className="p-3 border border-[#D4CDC3]/30 hover:border-white text-[#D4CDC3] hover:text-white transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-accent"
          aria-label="Next Slide"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Slide Navigation Indicators (Minimal text version instead of cluttered dots) */}
      <div className="absolute bottom-12 right-12 text-xs font-mono text-[#D4CDC3]/60 z-10">
        <span className="text-white font-bold">{activeIndex + 1}</span> &mdash; {slides.length}
      </div>
    </div>
  );
}
