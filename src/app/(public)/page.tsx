import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import HeroSlider from "@/components/HeroSlider";
import ServiceCard from "@/components/ServiceCard";
import PricingCard from "@/components/PricingCard";
import BookingCTA from "@/components/BookingCTA";
import TestimonialsSlider from "@/components/TestimonialsSlider";
import { FadeIn, RevealText, StaggerGroup, MotionSection } from "@/components/motion/MotionComponents";
import { CheckCircle2, ShieldCheck, Zap, Heart } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const titleSetting = await prisma.setting.findUnique({ where: { key: "seo_home_title" } });
  const descSetting = await prisma.setting.findUnique({ where: { key: "seo_home_desc" } });
  
  return {
    title: titleSetting?.value || "PureSweep Cleaning | Premium Cleaning Services in Auckland",
    description: descSetting?.value || "Refined residential, commercial, deep, carpet, and move-in/move-out cleaning services in Auckland.",
  };
}

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Puresweep",
    "image": "https://puresweep.co.nz/icon.png",
    "description": "Refined residential, commercial, deep, carpet, and move-in/move-out cleaning services in Auckland, New Zealand.",
    "url": "https://puresweep.co.nz",
    "telephone": "0210 269 9956",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Hillsborough",
      "addressLocality": "Auckland",
      "postalCode": "1042",
      "addressCountry": "NZ"
    },
    "areaServed": "Auckland",
    "priceRange": "$$"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="space-y-24 pb-20 overflow-x-hidden">
        {/* 2. Editorial Hero with Slow Slider */}
        <HeroSlider />

      {/* 3. Trust Strip */}
      <FadeIn delay={0.1}>
        <section className="border-b border-border bg-stone-50 py-10">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-border text-center md:text-left">
              <div className="md:px-4 py-4 md:py-0 flex flex-col md:flex-row items-center gap-4">
                <ShieldCheck className="h-6 w-6 text-accent shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Fully Vetted Cleaners</h4>
                  <p className="text-xs text-stone-500 mt-1">Police checked & security screened.</p>
                </div>
              </div>
              <div className="md:px-6 py-4 md:py-0 flex flex-col md:flex-row items-center gap-4">
                <CheckCircle2 className="h-6 w-6 text-accent shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Auckland Owned</h4>
                  <p className="text-xs text-stone-500 mt-1">Local care, serving central suburbs.</p>
                </div>
              </div>
              <div className="md:px-6 py-4 md:py-0 flex flex-col md:flex-row items-center gap-4">
                <Zap className="h-6 w-6 text-accent shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Clear Flat Pricing</h4>
                  <p className="text-xs text-stone-500 mt-1">No hidden fees, GST displayed.</p>
                </div>
              </div>
              <div className="md:px-6 py-4 md:py-0 flex flex-col md:flex-row items-center gap-4">
                <Heart className="h-6 w-6 text-accent shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">100% Satisfaction</h4>
                  <p className="text-xs text-stone-500 mt-1">Recleaned if standards aren&apos;t met.</p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </FadeIn>

      {/* 4. About Preview */}
      <MotionSection>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-5">
              <span className="font-caption block mb-3">Our Philosophy</span>
              <h2 className="font-serif text-[34px] md:text-[42px] lg:text-[48px] leading-[1.1] text-primary font-light">
                <RevealText text="Crafting serene, organized environments." />
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-6 text-stone-600">
              <p className="text-base font-light leading-relaxed">
                At PureSweep, we believe a clean environment is the foundation of clear thinking. We provide Auckland homeowners and businesses with consistent cleaning standards, verified workmen, and simple, upfront booking processes.
              </p>
              <p className="text-sm leading-relaxed">
                Our cleaners are trained to work in pairs with precise checklists, ensuring no detail is overlooked, from the high corners of your residential kitchen to the shared workspaces of your downtown commercial office.
              </p>
              <div className="pt-4">
                <Link href="/about" className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary hover:text-accent hover:border-accent pb-1 transition-colors">
                  Learn More About Our Team &rarr;
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </MotionSection>

      {/* 5. Services Preview */}
      <MotionSection className="bg-stone-50/50 py-20 border-y border-border">
        <Container className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <SectionHeader
              subtitle="Signature Offers"
              title="Meticulous Cleaning Services"
              description="Tailored residential, commercial, and restorative deep cleaning across central Auckland."
            />
            <Link href="/services" className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary hover:text-accent hover:border-accent pb-1 transition-colors shrink-0">
              All Cleaning Services
            </Link>
          </div>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              title="Residential Cleaning"
              slug="residential-cleaning"
              priceDesc="$40 + GST / hour"
              description="A refined home clean including detailed kitchen sanitization, vacuuming, mopping, dusting, and linen straightening."
              features={["Kitchen Counter Polishing", "Bathrooms & Toilet Scrubbing", "Dusting & Cobweb Sweeping", "Floor Mopping & Vacuuming"]}
            />
            <ServiceCard
              title="Commercial Cleaning"
              slug="commercial-cleaning"
              priceDesc="$45 + GST / hour"
              description="Hygienic workspace maintenance for boardrooms, shared desks, staff kitchens, and reception spaces in corporate offices."
              features={["Desk Sanitation", "Staff Kitchen Deep Cleaning", "Boardroom Upkeep", "Rubbish & Recycle Disposal"]}
            />
            <ServiceCard
              title="Specialized Deep Cleaning"
              slug="deep-cleaning"
              priceDesc="Starting at $320 + GST"
              description="Detailed restorative scrubbing of baseboards, tile grout lines, oven interior walls, and central window frames."
              features={["Skirting Board Hand-Wiping", "Tile Grout Line Restoration", "Oven Interior Polish", "Window Track Cleansing"]}
            />
          </StaggerGroup>
        </Container>
      </MotionSection>

      {/* 6. Pricing Preview */}
      <MotionSection>
        <Container className="space-y-12">
          <div className="text-center space-y-4">
            <SectionHeader
              align="center"
              subtitle="Clear Pricing"
              title="Flat Rates & Estimates"
              description="Simple pricing without hidden surprises. Select a category below to start your calculation."
            />
          </div>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title="2-Bedroom Home"
              price="$320"
              unit="+ GST flat"
              slug="residential-cleaning"
              description="Fixed price care for small houses and apartments."
              features={[
                "Full kitchen sanitization",
                "Up to 2 bathrooms scrubbed",
                "Vacuuming & mopping Central NZ",
                "Standard dust and wipe",
              ]}
            />
            <PricingCard
              title="3-Bedroom Home"
              price="$400"
              unit="+ GST flat"
              slug="residential-cleaning"
              isPopular={true}
              description="Perfect layout package for growing Auckland families."
              features={[
                "Includes 2 full bathrooms",
                "Detailed vacuuming and dusting",
                "Bed making & surface wipe",
                "Central Auckland travel covered",
              ]}
            />
            <PricingCard
              title="Carpet Clean Add-on"
              price="$250"
              unit="+ GST flat"
              slug="carpet-cleaning"
              description="Steam extraction treatment for carpets."
              features={[
                "2 bedrooms steam cleaned",
                "High suction extraction",
                "Pet odor neutralization",
                "Quick-dry process",
              ]}
            />
          </StaggerGroup>

          <div className="text-center pt-4">
            <Link href="/pricing" className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary hover:text-accent hover:border-accent pb-1 transition-colors">
              Compare Full Pricing Catalog &rarr;
            </Link>
          </div>
        </Container>
      </MotionSection>

      {/* 7. Why Choose PureSweep */}
      <MotionSection className="bg-stone-50/50 py-20 border-y border-border">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="font-caption block">Quality Standard</span>
              <h2 className="font-serif text-[34px] md:text-[42px] leading-tight text-primary font-light">
                Why Aucklanders trust PureSweep.
              </h2>
              <p className="text-sm text-stone-500 leading-relaxed font-light">
                We believe premium services require reliable systems. That is why we invest heavily in recruiting experienced staff, standardizing cleaning procedures, and providing clear invoice details.
              </p>
            </div>
            
            <StaggerGroup className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 border border-border p-6 bg-surface">
                <span className="font-serif text-lg text-primary">Consistent Cleaners</span>
                <p className="text-xs text-stone-500 leading-relaxed font-light">
                  We assign the same cleaners to your recurring schedule whenever possible, ensuring they learn your property layouts and details.
                </p>
              </div>
              <div className="space-y-2 border border-border p-6 bg-surface">
                <span className="font-serif text-lg text-primary">Eco-Friendly Solvents</span>
                <p className="text-xs text-stone-500 leading-relaxed font-light">
                  We utilize non-toxic, pet-safe, and biodegradable solvents that protect your surfaces, family, and the Auckland ecology.
                </p>
              </div>
              <div className="space-y-2 border border-border p-6 bg-surface">
                <span className="font-serif text-lg text-primary">NZ Certified Safety</span>
                <p className="text-xs text-stone-500 leading-relaxed font-light">
                  All cleaners undergo security screening and training on surface safety, keeping your fine stones and woods completely safe.
                </p>
              </div>
              <div className="space-y-2 border border-border p-6 bg-surface">
                <span className="font-serif text-lg text-primary">Insured Workmanship</span>
                <p className="text-xs text-stone-500 leading-relaxed font-light">
                  Every reservation is backed by full public liability insurance, providing absolute peace of mind during property access.
                </p>
              </div>
            </StaggerGroup>
          </div>
        </Container>
      </MotionSection>

      {/* 8. Testimonials Slider */}
      <TestimonialsSlider />

      {/* 9. Booking Call-to-Action */}
      <FadeIn>
        <BookingCTA />
      </FadeIn>
    </div>
    </>
  );
}
