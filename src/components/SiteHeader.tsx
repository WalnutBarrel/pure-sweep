"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "./Container";
import LogoNavbar from "./LogoNavbar";
import { Menu, X } from "lucide-react";

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
    { name: "Journal", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border transition-all duration-300">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center">
            <LogoNavbar className="h-10 md:h-12" />
          </Link>


          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-semibold uppercase tracking-widest transition-colors duration-hover ${isActive ? "text-primary border-b border-primary pb-1" : "text-muted-text hover:text-primary"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Book CTA */}
          <div className="hidden md:block">
            <Link href="/book-a-cleaning" className="btn-primary py-2.5 px-5 text-[10px]">
              Book a Cleaning
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-primary hover:text-accent transition-colors outline-none"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border absolute left-0 w-full animate-enter-fade">
          <nav className="flex flex-col p-6 space-y-4">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-xs font-semibold uppercase tracking-widest py-2 transition-colors ${isActive ? "text-primary pl-2 border-l border-primary" : "text-muted-text"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-border">
              <Link
                href="/book-a-cleaning"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full text-center block"
              >
                Book a Cleaning
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
