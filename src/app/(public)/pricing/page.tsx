import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import PricingCard from "@/components/PricingCard";
import BookingCTA from "@/components/BookingCTA";
import { HelpCircle } from "lucide-react";
import { FadeIn, RevealText, StaggerGroup, MotionSection } from "@/components/motion/MotionComponents";

export default function PricingPage() {
  const plans = [
    {
      title: "2-Bedroom Package",
      price: "$320",
      unit: "+ GST flat",
      slug: "residential-cleaning",
      description: "Fixed price package suitable for standard 2-bedroom Auckland residences and apartments.",
      features: [
        "Up to 2 bathrooms cleaned",
        "Kitchen countertops polished",
        "Vacuuming & mopping throughout",
        "Cobwebs swept & skirting wiped",
      ],
    },
    {
      title: "3-Bedroom Package",
      price: "$400",
      unit: "+ GST flat",
      slug: "residential-cleaning",
      isPopular: true,
      description: "Optimized checklist layout for standard 3-bedroom, 2-bathroom suburban family homes.",
      features: [
        "Includes 2 bathrooms completely scrubbed",
        "Dusting sills, ledges & wardrobes",
        "Trash emptying & bin bag placement",
        "Central Auckland travel costs included",
      ],
    },
    {
      title: "Specialized Carpet Clean",
      price: "$250",
      unit: "+ GST flat",
      slug: "carpet-cleaning",
      description: "Steam soil extraction for high-traffic rooms, hallways, and pet-occupied properties.",
      features: [
        "Includes 2 bedroom layouts",
        "Hot water soil extraction",
        "Safe eco-friendly sanitizing pre-spray",
        "High-density stain pretreating",
      ],
    },
  ];

  return (
    <div className="space-y-24 py-20 overflow-x-hidden font-sans">
      {/* Header */}
      <Container className="space-y-6">
        <div className="max-w-3xl space-y-4">
          <span className="font-caption block">Pricing Model</span>
          <h1 className="font-serif text-[38px] md:text-[50px] lg:text-[60px] text-primary leading-tight font-light tracking-tight">
            <RevealText text="Transparent, upfront rates." />
          </h1>
          <FadeIn delay={0.2}>
            <p className="text-sm md:text-base text-stone-500 font-sans leading-relaxed font-light">
              We provide clear flat-rate packages and simple hourly services. All pricing estimates are clearly subject to 15% GST and include fully insured Auckland staff.
            </p>
          </FadeIn>
        </div>
      </Container>

      {/* Pricing Cards */}
      <MotionSection className="bg-stone-50/50 py-20 border-y border-border">
        <Container className="space-y-12">
          <SectionHeader
            subtitle="Plan Rates"
            title="Standard Package Plans"
            description="Our packages cover common household requirements. All rates are subject to 15% GST."
          />

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.title}
                price={plan.price}
                unit={plan.unit}
                slug={plan.slug}
                isPopular={plan.isPopular}
                description={plan.description}
                features={plan.features}
              />
            ))}
          </StaggerGroup>
        </Container>
      </MotionSection>

      {/* Hourly Rates & Add-on Catalog Table */}
      <MotionSection>
        <Container className="space-y-10">
          <SectionHeader
            subtitle="Full Catalog"
            title="Hourly & Add-On Service Rates"
            description="Detailed breakdown of base parameters and custom cleaning options."
          />

          <div className="border border-border overflow-hidden bg-surface">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-border font-bold uppercase tracking-wider text-primary">
                  <th className="p-4 md:p-6">Service Form</th>
                  <th className="p-4 md:p-6">Pricing Standard</th>
                  <th className="p-4 md:p-6">Minimum Booking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="p-4 md:p-6 font-serif text-sm text-primary font-semibold">Residential Cleaning</td>
                  <td className="p-4 md:p-6 font-mono text-[#0F3D3E] font-medium">$40 + GST / hour</td>
                  <td className="p-4 md:p-6 text-stone-500">3 hours</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 font-serif text-sm text-primary font-semibold">Commercial Cleaning</td>
                  <td className="p-4 md:p-6 font-mono text-[#0F3D3E] font-medium">$45 + GST / hour</td>
                  <td className="p-4 md:p-6 text-stone-500">4 hours</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 font-serif text-sm text-primary font-semibold">Deep Clean Floor Package</td>
                  <td className="p-4 md:p-6 font-mono text-[#0F3D3E] font-medium">Starting at $320 + GST</td>
                  <td className="p-4 md:p-6 text-stone-500">Based on layout</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 font-serif text-sm text-primary font-semibold">Move-In / Move-Out Clean</td>
                  <td className="p-4 md:p-6 font-mono text-[#0F3D3E] font-medium">Starting at $320 + GST</td>
                  <td className="p-4 md:p-6 text-stone-500">Based on layout</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 font-serif text-sm text-primary font-semibold">Oven Deep Clean Add-On</td>
                  <td className="p-4 md:p-6 font-mono text-[#0F3D3E] font-medium">$67 + GST flat</td>
                  <td className="p-4 md:p-6 text-stone-500">No minimum</td>
                </tr>
                <tr>
                  <td className="p-4 md:p-6 font-serif text-sm text-primary font-semibold">Post-Construction Clean</td>
                  <td className="p-4 md:p-6 font-mono text-[#0F3D3E] font-medium">Starting at $400 + GST</td>
                  <td className="p-4 md:p-6 text-stone-500">Based on layout</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Container>
      </MotionSection>

      {/* FAQ Grid */}
      <MotionSection>
        <Container className="space-y-12">
          <SectionHeader
            subtitle="Helpful Info"
            title="Common Invoicing Queries"
            description="Clear answers regarding our billing, GST, and scheduling policies."
          />

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed">
            <div className="space-y-2 border border-border p-6 bg-surface">
              <div className="flex gap-2.5 items-center text-primary font-semibold text-sm">
                <HelpCircle className="h-4 w-4 text-accent shrink-0" />
                <span>Are your estimates inclusive of GST?</span>
              </div>
              <p className="text-stone-500 pl-6 font-light">
                No. Our standard rates (e.g., $40/hour for residential) do not include GST. A 15% New Zealand Goods and Services Tax (GST) is calculated and added during the booking validation process, clearly itemized on all final invoices.
              </p>
            </div>

            <div className="space-y-2 border border-border p-6 bg-surface">
              <div className="flex gap-2.5 items-center text-primary font-semibold text-sm">
                <HelpCircle className="h-4 w-4 text-accent shrink-0" />
                <span>How are extra bedrooms and bathrooms billed?</span>
              </div>
              <p className="text-stone-500 pl-6 font-light">
                For flat-rate packages, our baseline starts at 2 bedrooms. Each additional bedroom adds $60 + GST, and each extra bathroom adds $45 + GST, reflecting the additional scrubbing time required by our paired cleaners.
              </p>
            </div>

            <div className="space-y-2 border border-border p-6 bg-surface">
              <div className="flex gap-2.5 items-center text-primary font-semibold text-sm">
                <HelpCircle className="h-4 w-4 text-accent shrink-0" />
                <span>Do you charge travel fees within Auckland?</span>
              </div>
              <p className="text-stone-500 pl-6 font-light">
                Travel is covered in our flat rates for central Auckland suburbs (Ponsonby, Remuera, Hillsborough, Grey Lynn, Epsom). Outer locations in East/North Auckland may be subject to a small transit supplement.
              </p>
            </div>

            <div className="space-y-2 border border-border p-6 bg-surface">
              <div className="flex gap-2.5 items-center text-primary font-semibold text-sm">
                <HelpCircle className="h-4 w-4 text-accent shrink-0" />
                <span>When is payment processed?</span>
              </div>
              <p className="text-stone-500 pl-6 font-light">
                Payment is processed only after your scheduled slot is complete. We issue secure online invoice links supporting credit card and direct bank deposits (POLi / bank transfer) immediately following service delivery.
              </p>
            </div>
          </StaggerGroup>
        </Container>
      </MotionSection>

      {/* Booking CTA */}
      <FadeIn>
        <BookingCTA />
      </FadeIn>
    </div>
  );
}
