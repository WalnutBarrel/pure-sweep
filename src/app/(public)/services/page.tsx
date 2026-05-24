import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import ServiceCard from "@/components/ServiceCard";
import BookingCTA from "@/components/BookingCTA";
import { FadeIn, RevealText, StaggerGroup, MotionSection } from "@/components/motion/MotionComponents";

export async function generateMetadata(): Promise<Metadata> {
  const titleSetting = await prisma.setting.findUnique({ where: { key: "seo_services_title" } });
  const descSetting = await prisma.setting.findUnique({ where: { key: "seo_services_desc" } });
  
  return {
    title: titleSetting?.value || "Our Services | PureSweep Cleaning Auckland",
    description: descSetting?.value || "Explore our range of premium cleaning services including residential, commercial, deep cleaning, carpet cleaning, and move-in/move-out cleans in Auckland.",
  };
}

export default function ServicesPage() {
  const services = [
    {
      title: "Residential Cleaning",
      slug: "residential-cleaning",
      priceDesc: "$40 + GST / hour",
      description: "Dedicated upkeep for houses, apartments, and townhouses. Covers dust sanitization, vacuuming, mopping, bed making, and countertop polishing.",
      features: [
        "Kitchen polish & oven exterior",
        "Shower screens, toilets & vanities",
        "Dusting all skirting boards & sills",
        "Bed linen straightening",
      ],
    },
    {
      title: "Commercial Cleaning",
      slug: "commercial-cleaning",
      priceDesc: "$45 + GST / hour",
      description: "Consistent hygiene management for corporate offices, clinics, and studios in central Auckland. Configured around your desk layouts and operational hours.",
      features: [
        "Meeting room surface sanitization",
        "Staff kitchen sink & dishwasher scrub",
        "Emptying waste & sorting recyclables",
        "High-density carpet vacuuming",
      ],
    },
    {
      title: "Deep Cleaning",
      slug: "deep-cleaning",
      priceDesc: "Starting at $320 + GST",
      description: "A detailed top-to-bottom scrub targeting hidden dust accumulation, door frames, kitchen appliances, and window tracks.",
      features: [
        "Page-wiping of all baseboards & architraves",
        "Tile grout pressure sanitization",
        "Air vent dust extraction",
        "Window frame & track cleaning",
      ],
    },
    {
      title: "Move-in / Move-out Cleaning",
      slug: "move-in-move-out-cleaning",
      priceDesc: "Starting at $320 + GST",
      description: "Bond-back guarantee clean for empty rental properties. Includes interior cupboard dusting, oven degreasing, and wall mark checks.",
      features: [
        "Inside pantry & drawer dusting",
        "Oven & rangehood grease cleaning",
        "Light switch & powerpoint wiping",
        "Full dust and vacuum cycle",
      ],
    },
    {
      title: "Carpet Steam Cleaning",
      slug: "carpet-cleaning",
      priceDesc: "$250 + GST flat",
      description: "Hot water extraction treatment for high-traffic carpeting. Neutralizes pet dander, removes deep dirt particles, and speeds up drying times.",
      features: [
        "Hot water extraction treatment",
        "Deep fiber soil extraction",
        "Odor neutralizing pre-spray",
        "Pet hair and dander removal",
      ],
    },
    {
      title: "Post-Construction Cleaning",
      slug: "post-construction-cleaning",
      priceDesc: "Starting at $400 + GST",
      description: "Eliminates plaster dust, paint splatters, and sawdust from newly renovated Auckland properties. Prepares your space for immediate move-in.",
      features: [
        "Plaster dust microfiber wiping",
        "Window paint & tape removal",
        "Cabinet interior vacuuming",
        "Hardware and glass polishing",
      ],
    },
  ];

  return (
    <div className="space-y-24 py-20 overflow-x-hidden">
      {/* Header */}
      <Container className="space-y-6">
        <div className="max-w-3xl space-y-4">
          <span className="font-caption block">Service Catalog</span>
          <h1 className="font-serif text-[38px] md:text-[50px] lg:text-[60px] text-primary leading-tight font-light tracking-tight">
            <RevealText text="Our specialized cleaning solutions." />
          </h1>
          <FadeIn delay={0.2}>
            <p className="text-sm md:text-base text-stone-500 font-sans leading-relaxed font-light">
              We divide our offers into clear, standard-based packages. All reservations include professional tools, eco-friendly solvents, and vetted cleaners working in pairs.
            </p>
          </FadeIn>
        </div>
      </Container>

      {/* Grid of Services */}
      <MotionSection className="bg-stone-50/50 py-20 border-y border-border">
        <Container className="space-y-12">
          <SectionHeader
            subtitle="Details"
            title="Premium Cleaning Formats"
            description="Select a cleaning service below. Clicking book will automatically configure our reservation invoice engine."
          />

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                slug={service.slug}
                priceDesc={service.priceDesc}
                description={service.description}
                features={service.features}
              />
            ))}
          </StaggerGroup>
        </Container>
      </MotionSection>

      {/* Dynamic Booking Notice */}
      <MotionSection>
        <Container>
          <div className="border border-border p-8 md:p-12 bg-surface grid grid-cols-1 md:grid-cols-12 gap-8 items-center font-sans">
            <div className="md:col-span-8 space-y-3">
              <h3 className="font-serif text-2xl text-primary font-light">Need a customized cleaning schedule?</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                For complex Auckland properties, commercial offices over 500 sqm, or custom frequencies (e.g. daily, twice-weekly), our managers can conduct an on-site walkthrough to draft a customized operational proposal.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <a href="/contact" className="btn-primary inline-block uppercase text-xs tracking-widest px-8">
                Request Walkthrough
              </a>
            </div>
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
