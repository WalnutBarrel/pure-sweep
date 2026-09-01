import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import BookingCTA from "@/components/BookingCTA";
import { FadeIn, RevealText, MotionSection } from "@/components/motion/MotionComponents";
import { AUCKLAND_LOCATIONS } from "@/lib/locations";
import { MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Areas We Service in Auckland | PureSweep Cleaning",
  description:
    "Explore our Auckland cleaning service areas including Ponsonby, Remuera, Grey Lynn, Auckland CBD, North Shore, Manukau, Mount Eden, and East Tamaki.",
  alternates: {
    canonical: "https://puresweep.co.nz/locations",
  },
};

export default function LocationsIndexPage() {
  return (
    <div className="space-y-24 pb-20 overflow-x-hidden">
      {/* Hero */}
      <section className="bg-stone-100/70 border-b border-border py-20 md:py-28 relative overflow-hidden">
        <div className="noise-overlay" />
        <Container className="relative z-10 space-y-6 max-w-3xl">
          <FadeIn>
            <span className="font-caption block">Service Network</span>
          </FadeIn>
          <h1 className="font-serif text-[38px] md:text-[50px] leading-[1.1] text-primary font-light">
            <RevealText text="Auckland Suburbs & Service Areas." />
          </h1>
          <p className="text-base md:text-lg text-stone-600 font-light leading-relaxed">
            PureSweep provides reliable residential house cleaning, corporate office upkeep, and deep restorative cleaning across central and wider Auckland suburbs.
          </p>
        </Container>
      </section>

      {/* Locations Grid */}
      <MotionSection>
        <Container className="space-y-12">
          <SectionHeader
            subtitle="Explore Suburbs"
            title="Choose Your Auckland Neighborhood"
            description="Select your suburb to see localized service details, checklists, and upfront pricing."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AUCKLAND_LOCATIONS.map((loc) => (
              <div
                key={loc.slug}
                className="bg-surface border border-border p-8 flex flex-col justify-between space-y-6 hover:border-accent/50 transition-all hover:shadow-xs"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold text-accent">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{loc.region}</span>
                  </div>
                  <h3 className="font-serif text-2xl text-primary font-normal">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-light">
                    {loc.intro}
                  </p>
                  <ul className="space-y-1.5 pt-2 text-xs text-stone-600">
                    {loc.areaFeatures.slice(0, 2).map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/locations/${loc.slug}`}
                  className="inline-flex items-center justify-between text-xs uppercase tracking-widest font-bold text-primary hover:text-accent transition-colors pt-4 border-t border-border/60"
                >
                  <span>View {loc.name} Services</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </MotionSection>

      {/* Booking CTA */}
      <FadeIn>
        <BookingCTA />
      </FadeIn>
    </div>
  );
}
