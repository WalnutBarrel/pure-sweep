import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { cache } from "react";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

// Dedupe Prisma calls across generateMetadata and the page component
const getService = cache(async (slug: string) => {
  return await prisma.service.findUnique({ where: { slug } });
});

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service || !service.isActive) {
    return {
      title: "Service Not Found",
      robots: { index: false }
    };
  }

  return {
    title: `${service.name} | PureSweep Cleaning`,
    description: service.description,
    alternates: {
      canonical: `https://puresweep.co.nz/services/${slug}`,
    },
    openGraph: {
      title: `${service.name} | PureSweep Cleaning`,
      description: service.description,
      url: `https://puresweep.co.nz/services/${slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service || !service.isActive) {
    notFound();
  }

  return (
    <div className="container mx-auto py-20 max-w-4xl space-y-12 animate-enter-fade">
      <Link href="/services" className="text-xs font-semibold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">
        ← Back to Services
      </Link>

      <div className="space-y-6 border-b border-border pb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-light text-primary">{service.name}</h1>
        <div className="font-serif text-lg italic text-muted-foreground">{service.priceDescription}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-4">
        <div className="md:col-span-2 space-y-6">
          <h2 className="font-serif text-2xl font-light text-primary">Overview</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {service.description}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Every room is inspected against our editorial quality checklist. We clean corners, dust ceiling fans, vacuum behind couches, and disinfect high-touch areas. We use only premium products to ensure your space smells clean and remains free of chemical allergens.
          </p>
        </div>

        <div className="space-y-6 bg-stone-50 border border-border p-6 h-fit">
          <h3 className="font-serif text-lg italic text-primary">Need a quote?</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Provide details of your Auckland property for an instant pricing calculation and date booking.
          </p>
          <Link
            href={`/booking?service=${slug}`}
            className="btn-press block text-center bg-primary text-primary-foreground border border-primary px-4 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-transparent hover:text-primary transition-all duration-200"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}
