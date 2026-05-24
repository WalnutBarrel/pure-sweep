import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { PageTransition } from "@/components/motion/MotionComponents";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-all duration-300">
      {/* Top Refined Border & Auckland Notice */}
      <div className="border-b border-border bg-background py-2 text-center text-[10px] tracking-widest uppercase text-muted-text">
        Professional Cleaning Services — Auckland, New Zealand
      </div>

      {/* Global Brand Header */}
      <SiteHeader />

      {/* Main Content Area */}
      <main className="flex-1 bg-background">
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Global Brand Footer */}
      <SiteFooter />
    </div>
  );
}
