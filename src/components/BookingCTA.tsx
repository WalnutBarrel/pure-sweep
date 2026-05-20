import Link from "next/link";
import Container from "./Container";

interface BookingCTAProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function BookingCTA({
  title = "Ready for a cleaner space?",
  description = "Schedule your service online with transparent pricing. Our team of experienced Auckland cleaners is ready to assist you.",
  className = "",
}: BookingCTAProps) {
  return (
    <section className={`bg-primary-soft/30 border-y border-border py-20 ${className}`}>
      <Container>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12">
          <div className="space-y-3 max-w-2xl">
            <h2 className="font-serif text-3xl md:text-4xl text-primary font-light tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-sm text-stone-600 font-sans leading-relaxed">
              {description}
            </p>
          </div>
          <div className="flex flex-row gap-4 shrink-0">
            <Link href="/book-a-cleaning" className="btn-primary px-8 text-xs">
              Book a Cleaning
            </Link>
            <Link href="/contact" className="btn-outline border-primary text-primary hover:bg-primary hover:text-surface px-8 text-xs">
              Contact Team
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
