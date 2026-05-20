import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

interface ServiceCardProps {
  title: string;
  slug: string;
  description: string;
  priceDesc: string;
  features: string[];
}

export default function ServiceCard({
  title,
  slug,
  description,
  priceDesc,
  features,
}: ServiceCardProps) {
  return (
    <div className="bg-surface border border-border p-8 flex flex-col justify-between hover:border-accent transition-all duration-300 group">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="font-serif text-2xl text-primary font-normal group-hover:text-accent transition-colors duration-hover">
            {title}
          </h3>
          <p className="text-xs uppercase tracking-widest text-[#B58A4A] font-bold">
            {priceDesc}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-stone-500 font-sans leading-relaxed">
          {description}
        </p>

        {/* Feature List */}
        <ul className="space-y-3 pt-2">
          {features.slice(0, 4).map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-stone-600">
              <Check className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action CTA */}
      <div className="pt-8 border-t border-border mt-8 flex items-center justify-between">
        <Link
          href={`/book-a-cleaning?service=${slug}`}
          className="text-xs font-bold uppercase tracking-widest text-primary hover:text-accent flex items-center gap-1.5 transition-colors"
        >
          Book This Clean
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
