import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import BookingCTA from "@/components/BookingCTA";
import { FadeIn, RevealText, StaggerGroup, MotionSection } from "@/components/motion/MotionComponents";
import { ShieldCheck, Heart, Users, Star } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const titleSetting = await prisma.setting.findUnique({ where: { key: "seo_about_title" } });
  const descSetting = await prisma.setting.findUnique({ where: { key: "seo_about_desc" } });
  
  return {
    title: titleSetting?.value || "About Us | PureSweep Cleaning Auckland",
    description: descSetting?.value || "Learn about PureSweep Cleaning, Auckland's most trusted premium cleaning team.",
  };
}

export default function AboutPage() {
  return (
    <div className="space-y-24 py-20 overflow-x-hidden">
      {/* Editorial Header */}
      <Container className="space-y-6">
        <div className="max-w-3xl space-y-4">
          <span className="font-caption block">Our Journey</span>
          <h1 className="font-serif text-[38px] md:text-[50px] lg:text-[60px] text-primary leading-tight font-light tracking-tight">
            <RevealText text="Setting the standard for Auckland spaces." />
          </h1>
          <FadeIn delay={0.2}>
            <p className="text-sm md:text-base text-stone-500 font-sans leading-relaxed font-light">
              Founded with a vision to move away from rushed, checklist-only cleaning services, PureSweep treats cleaning as an editorial art form. We specialize in maintaining modern residences and architectural offices throughout central Auckland.
            </p>
          </FadeIn>
        </div>
      </Container>

      {/* Core Principles */}
      <MotionSection className="bg-stone-50 py-20 border-y border-border">
        <Container className="space-y-12">
          <SectionHeader
            subtitle="Philosophy"
            title="The Pillars of PureSweep"
            description="Our service standards are built upon trust, craftsmanship, and simple client communications."
          />

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-surface border border-border p-6 space-y-4">
              <ShieldCheck className="h-6 w-6 text-accent" />
              <h3 className="font-serif text-lg text-primary">Uncompromising Trust</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                All staff go through comprehensive background audits, references verification, and character reference assessments before client assignment.
              </p>
            </div>

            <div className="bg-surface border border-border p-6 space-y-4">
              <Users className="h-6 w-6 text-accent" />
              <h3 className="font-serif text-lg text-primary">Paired Cleaners</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                We work in pairs using structured rooms protocols. This allows our cleaners to keep each other accountable and check off fine details.
              </p>
            </div>

            <div className="bg-surface border border-border p-6 space-y-4">
              <Star className="h-6 w-6 text-accent" />
              <h3 className="font-serif text-lg text-primary">Consistent Quality</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                We assign designated cleaners to recurring bookings so they learn your specific flooring, benchtop parameters, and home directives.
              </p>
            </div>

            <div className="bg-surface border border-border p-6 space-y-4">
              <Heart className="h-6 w-6 text-accent" />
              <h3 className="font-serif text-lg text-primary">Eco-Conscious Care</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-light">
                We utilize non-toxic, pet-safe sanitizing agents, protecting both your delicate wood veneers and our beautiful Auckland environment.
              </p>
            </div>
          </StaggerGroup>
        </Container>
      </MotionSection>

      {/* Team Details & Auckland Suburbs */}
      <MotionSection>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-caption block">Coverage Zone</span>
              <h2 className="font-serif text-3xl text-primary font-light">
                Proudly servicing the greater Auckland area.
              </h2>
              <p className="text-xs text-stone-500 font-sans leading-relaxed">
                From our main operations room in Hillsborough, we service clients across Central Auckland, Ponsonby, Remuera, Epsom, Mount Eden, Grey Lynn, and West Auckland.
              </p>
            </div>
            <div className="lg:col-span-7 bg-[#0F3D3E] text-[#E5E0D8] p-10 space-y-6">
              <h3 className="font-serif text-2xl text-white font-light">Our Promise</h3>
              <p className="text-sm leading-relaxed font-light text-[#B2ABA0]">
                If you ever feel a service standard was missed, contact our team within 24 hours. We will dispatch a manager to inspect and reclean the specific surfaces completely free of charge. Your satisfaction is our absolute priority.
              </p>
              <div className="border-t border-[#2D3835] pt-6 flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold text-white">PureSweep Leadership Team</p>
                  <p className="text-[10px] text-[#B2ABA0] mt-0.5">Auckland Operations Control</p>
                </div>
                <span className="font-serif italic text-accent text-lg">PureSweep.</span>
              </div>
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
