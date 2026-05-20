"use client";

import { motion, useReducedMotion } from "framer-motion";
import React from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.55,
  y = 12,
  className = "",
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        delay,
        ease: [0.23, 1, 0.32, 1] as const,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealText({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
        delayChildren: delay,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: [0.23, 1, 0.32, 1] as const,
      },
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`inline-block ${className}`}
    >
      {words.map((word, idx) => (
        <span key={idx} className="inline-block mr-[0.22em] whitespace-nowrap overflow-hidden">
          <motion.span variants={childVariants} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

interface StaggerGroupProps {
  children: React.ReactNode;
  delay?: number;
  staggerDelay?: number;
  className?: string;
}

export function StaggerGroup({
  children,
  delay = 0,
  staggerDelay = 0.08,
  className = "",
}: StaggerGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        const itemVariants = {
          hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: shouldReduceMotion ? 0 : 0.55,
              ease: [0.23, 1, 0.32, 1] as const,
            },
          },
        };

        return <motion.div variants={itemVariants}>{child}</motion.div>;
      })}
    </motion.div>
  );
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: [0.23, 1, 0.32, 1] as const,
      }}
    >
      {children}
    </motion.div>
  );
}

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}

export function MotionSection({
  children,
  className = "",
  delay = 0,
  id,
}: MotionSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.65,
        delay,
        ease: [0.23, 1, 0.32, 1] as const,
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
