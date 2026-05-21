import ContactBlock from "@/components/ContactBlock";
import ContactForm from "./ContactForm";

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
