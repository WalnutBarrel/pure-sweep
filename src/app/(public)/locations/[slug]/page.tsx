import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import BookingCTA from "@/components/BookingCTA";
import { FadeIn, RevealText, StaggerGroup, MotionSection } from "@/components/motion/MotionComponents";
import { AUCKLAND_LOCATIONS, getLocationBySlug } from "@/lib/locations";
import { CheckCircle2, ArrowRight, MapPin, Sparkles } from "lucide-react";

interface LocationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return AUCKLAND_LOCATIONS.map((loc) => ({
    slug: loc.slug,
  }));
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocationBySlug(slug);

  if (!location) {
    return {
      title: "Location Not Found | PureSweep Cleaning Auckland",
    };
  }

  return {
    title: location.title,
    description: location.metaDescription,
    alternates: {
      canonical: `https://puresweep.co.nz/locations/${location.slug}`,
    },
    openGraph: {
      title: location.title,
      description: location.metaDescription,
      url: `https://puresweep.co.nz/locations/${location.slug}`,
      locale: "en_NZ",
      type: "website",
    },
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `PureSweep Cleaning ${location.name}`,
    "image": "https://puresweep.co.nz/icon.png",
    "description": location.metaDescription,
    "url": `https://puresweep.co.nz/locations/${location.slug}`,
    "telephone": "0210 269 9956",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location.name,
      "addressRegion": "Auckland",
      "postalCode": location.postcode,
      "addressCountry": "NZ"
    },
    "areaServed": {
      "@type": "Place",
      "name": `${location.name}, Auckland`
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": location.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  const otherLocations = AUCKLAND_LOCATIONS.filter((l) => l.slug !== location.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="space-y-24 pb-20 overflow-x-hidden">
        {/* Hero Section */}
        <section className="bg-stone-100/70 border-b border-border py-20 md:py-28 relative overflow-hidden">
          <div className="noise-overlay" />
          <Container className="relative z-10 space-y-6 max-w-4xl">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-border text-xs uppercase tracking-widest text-primary font-semibold">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                <span>{location.region} &bull; {location.name}, Auckland</span>
              </div>
            </FadeIn>

            <h1 className="font-serif text-[36px] md:text-[48px] lg:text-[54px] leading-[1.1] text-primary font-light">
              <RevealText text={location.headline} />
            </h1>

            <p className="text-base md:text-lg text-stone-600 font-light leading-relaxed max-w-3xl">
              {location.intro}
            </p>

            <FadeIn delay={0.2}>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/book-a-cleaning"
                  className="bg-primary text-white text-xs uppercase tracking-widest font-bold px-7 py-3.5 hover:bg-accent transition-colors duration-hover inline-flex items-center gap-2"
                >
                  <span>Book in {location.name}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="bg-surface border border-border text-primary text-xs uppercase tracking-widest font-bold px-6 py-3.5 hover:bg-stone-50 transition-colors duration-hover"
                >
                  View Rates
                </Link>
              </div>
            </FadeIn>
          </Container>
        </section>

        {/* Key Area Features */}
        <MotionSection>
          <Container className="max-w-5xl">
            <div className="border border-border bg-surface p-8 md:p-12 space-y-8">
              <SectionHeader
                subtitle="Service Coverage"
                title={`Cleaning Tailored for ${location.name} Properties`}
                description="Our standard checklists and specialized equipment cater directly to local home layouts and commercial spaces."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-4">
                {location.areaFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 p-4 bg-stone-50/70 border border-border/60">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-stone-700 font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </MotionSection>

        {/* Popular Services in this Suburb */}
        <MotionSection className="bg-stone-50/50 py-20 border-y border-border">
          <Container className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <SectionHeader
                subtitle="Popular Options"
                title={`Available Services in ${location.name}`}
                description="Choose from ongoing residential maintenance, corporate office hygiene, or deep restoration cleans."
              />
              <Link
                href="/services"
                className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary hover:text-accent hover:border-accent pb-1 transition-colors shrink-0"
              >
                All Services &rarr;
              </Link>
            </div>

            <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {location.popularServices.map((svc, idx) => (
                <div key={idx} className="bg-surface border border-border p-8 flex flex-col justify-between space-y-6 hover:border-accent/40 transition-colors">
                  <div className="space-y-4">
                    <span className="text-xs uppercase tracking-widest text-accent font-bold block">
                      {svc.price}
                    </span>
                    <h3 className="font-serif text-2xl text-primary font-normal">
                      {svc.title}
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed font-light">
                      {svc.description}
                    </p>
                  </div>

                  <Link
                    href={`/book-a-cleaning?service=${svc.slug}`}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-primary hover:text-accent transition-colors pt-2 border-t border-border/60"
                  >
                    <span>Book this service</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </StaggerGroup>
          </Container>
        </MotionSection>

        {/* Local Area FAQs */}
        <MotionSection>
          <Container className="max-w-4xl space-y-8">
            <SectionHeader
              align="center"
              subtitle="Local FAQs"
              title={`${location.name} Cleaning Questions`}
              description="Common inquiries from clients booking residential and commercial services in this area."
            />

            <div className="divide-y divide-border border border-border bg-surface">
              {location.faqs.map((faq, idx) => (
                <div key={idx} className="p-6 md:p-8 space-y-2">
                  <h4 className="font-serif text-lg text-primary font-normal flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-accent shrink-0 mt-1" />
                    <span>{faq.question}</span>
                  </h4>
                  <p className="text-sm text-stone-600 font-sans leading-relaxed pl-7">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </MotionSection>

        {/* Other Auckland Locations (Internal Linking) */}
        <MotionSection className="bg-stone-50/70 py-16 border-y border-border">
          <Container className="space-y-6">
            <h3 className="font-serif text-xl text-primary font-light">
              Explore Other Auckland Areas We Service:
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {otherLocations.map((other) => (
                <Link
                  key={other.slug}
                  href={`/locations/${other.slug}`}
                  className="px-4 py-2 bg-surface border border-border text-xs text-stone-700 hover:text-primary hover:border-accent transition-colors"
                >
                  {other.name} Cleaning
                </Link>
              ))}
            </div>
          </Container>
        </MotionSection>

        {/* Booking CTA */}
        <FadeIn>
          <BookingCTA />
        </FadeIn>
      </div>
    </>
  );
}
