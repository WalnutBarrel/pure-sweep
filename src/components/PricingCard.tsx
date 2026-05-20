import Link from "next/link";
import { Check } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  slug: string;
  isPopular?: boolean;
}

export default function PricingCard({
  title,
  price,
  unit,
  description,
  features,
  slug,
  isPopular = false,
}: PricingCardProps) {
  return (
    <div
      className={`border p-8 flex flex-col justify-between transition-all duration-300 relative ${
        isPopular
          ? "border-primary bg-primary-soft/10 ring-1 ring-primary"
          : "border-border bg-surface hover:border-accent"
      }`}
    >
      {isPopular && (
        <span className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-surface text-[9px] uppercase tracking-widest font-bold py-1 px-3">
          Recommended
        </span>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="font-serif text-2xl text-primary font-normal">{title}</h3>
          <p className="text-xs text-stone-500 font-sans">{description}</p>
        </div>

        {/* Pricing tag */}
        <div className="flex items-baseline space-x-1 border-b border-border/60 pb-6">
          <span className="text-4xl font-serif font-light text-stone-900">{price}</span>
          <span className="text-xs text-stone-500 font-sans tracking-wide">{unit}</span>
        </div>

        {/* Features List */}
        <ul className="space-y-3.5 pt-2">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs text-stone-600">
              <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action CTA */}
      <div className="pt-8 mt-8">
        <Link
          href={`/book-a-cleaning?service=${slug}`}
          className={`w-full text-center block ${
            isPopular ? "btn-primary py-3.5" : "btn-outline py-3.5"
          }`}
        >
          Request Schedule Slot
        </Link>
      </div>
    </div>
  );
}
