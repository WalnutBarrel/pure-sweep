import Link from "next/link";
import { notFound } from "next/navigation";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

const SERVICES_DATA: Record<string, { name: string; price: string; desc: string }> = {
  "residential-cleaning": {
    name: "Residential Cleaning",
    price: "$40 + GST / hour",
    desc: "Meticulous dust extraction, vacuuming, mopping, and medical-grade sanitation for your home.",
  },
  "commercial-cleaning": {
    name: "Commercial Cleaning",
    price: "$45 + GST / hour",
    desc: "Maintain a flawless corporate environment with office sanitizing, common area scrubs, and workspace cleaning.",
  },
  "carpet-cleaning": {
    name: "Carpet Cleaning",
    price: "$250 + GST (2-bedroom house)",
    desc: "Professional hot-water extraction, pre-treatments, and allergen removal to restore carpet fibers.",
  },
  "deep-cleaning": {
    name: "Deep Cleaning",
    price: "Starting at $320 + GST",
    desc: "A meticulous top-to-bottom scrub targeting baseboards, hard-to-reach dust, and detailed kitchen and bath scaling.",
  },
  "move-in-move-out-cleaning": {
    name: "Move-in / Move-out Cleaning",
    price: "Starting at $320 + GST",
    desc: "Bond-back guarantee detailed cleanings for property managers and tenants moving residences.",
  },
  "post-construction-cleaning": {
    name: "Post-Construction Cleaning",
    price: "Starting at $400 + GST",
    desc: "Eliminates plaster dust, construction residue, and builders paint splatters to make new builds ready for occupancy.",
  },
};

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = SERVICES_DATA[slug];

  if (!service) {
    notFound();
  }

  return (
    <div className="container mx-auto py-20 max-w-4xl space-y-12 animate-enter-fade">
      <Link href="/services" className="text-xs font-semibold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">
        ← Back to Services
      </Link>

      <div className="space-y-6 border-b border-border pb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-light text-primary">{service.name}</h1>
        <div className="font-serif text-lg italic text-muted-foreground">{service.price}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-4">
        <div className="md:col-span-2 space-y-6">
          <h2 className="font-serif text-2xl font-light text-primary">Overview</h2>
          <p className="text-muted-foreground leading-relaxed">
            {service.desc}
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
