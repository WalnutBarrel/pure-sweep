import React from "react";

interface SectionHeaderProps {
  subtitle?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export default function SectionHeader({
  subtitle,
  title,
  description,
  className = "",
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={`space-y-3 ${
        align === "center" ? "text-center mx-auto max-w-2xl" : "text-left"
      } ${className}`}
    >
      {subtitle && (
        <span className="font-sans text-xs font-bold tracking-widest uppercase text-accent mb-1 block">
          {subtitle}
        </span>
      )}
      <h2 className="font-serif text-[26px] md:text-[30px] lg:text-[36px] font-light leading-snug tracking-tight text-primary">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-stone-500 font-sans leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
