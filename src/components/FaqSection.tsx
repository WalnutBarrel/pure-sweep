"use client";

import React, { useState } from "react";
import Container from "./Container";
import SectionHeader from "./SectionHeader";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQ_ITEMS } from "@/lib/faqs";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-stone-50/70 border-y border-border relative">
      <Container className="max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <SectionHeader
            align="center"
            subtitle="Common Inquiries"
            title="Frequently Asked Questions"
            description="Clear answers about our Auckland house cleaning, office maintenance, pricing, and guarantee."
          />
        </div>

        <div className="divide-y divide-border border border-border bg-surface shadow-xs">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="transition-colors hover:bg-stone-50/40">
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full py-5 px-6 md:px-8 flex items-center justify-between text-left gap-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base md:text-lg text-primary font-normal">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-stone-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-8 pb-6 text-sm text-stone-600 font-sans leading-relaxed border-t border-border/40 pt-3">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
