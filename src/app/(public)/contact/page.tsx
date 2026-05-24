import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import ContactBlock from "@/components/ContactBlock";
import ContactForm from "./ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const titleSetting = await prisma.setting.findUnique({ where: { key: "seo_contact_title" } });
  const descSetting = await prisma.setting.findUnique({ where: { key: "seo_contact_desc" } });
  
  return {
    title: titleSetting?.value || "Contact Us | PureSweep Cleaning Auckland",
    description: descSetting?.value || "Get in touch with PureSweep Cleaning. Request a custom quote, ask a question, or reach out to our Auckland team.",
  };
}

export default function ContactPage() {
  return (
    <div className="container mx-auto py-20 px-6 max-w-6xl animate-enter-fade">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Info Column (ContactBlock) */}
        <div className="lg:col-span-5">
          <ContactBlock />
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7 bg-surface border border-border p-8 md:p-10 font-sans">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
