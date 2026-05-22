import Link from "next/link";
import Container from "./Container";
import prisma from "@/lib/prisma";
import LogoNavbar from "./LogoNavbar";

export default async function SiteFooter() {
  const currentYear = new Date().getFullYear();
  let emailSetting, phoneSetting;
  try {
    emailSetting = await prisma.setting.findUnique({ where: { key: "contact_email" } });
    phoneSetting = await prisma.setting.findUnique({ where: { key: "contact_phone" } });
  } catch (err) {
    console.warn("Could not fetch settings for SiteFooter, falling back to defaults.");
  }
  
  const contactEmail = emailSetting?.value || "contact.puresweep@gmail.com";
  const contactPhone = phoneSetting?.value || "021-026999-56";

  return (
    <footer className="bg-[#1C2422] text-[#E5E0D8] border-t border-[#2D3835] pt-20 pb-12 font-sans">
      <Container className="space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & About Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center select-none">
              <img 
                src="/images/puresweep-logo.png" 
                alt="PureSweep Cleaning" 
                className="h-16 w-auto object-contain" 
              />
            </Link>
            <p className="text-xs text-[#B2ABA0] leading-relaxed max-w-xs">
              Exceptional residential and commercial cleaning services based in Hillsborough, Auckland. Setting standards through workmanship, clear pricing, and careful attention.
            </p>
          </div>

          {/* Directory Column */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-white">
              Nav Directory
            </h4>
            <ul className="space-y-2 text-xs text-[#B2ABA0]">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors duration-hover">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-accent transition-colors duration-hover">
                  Cleaning Services
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-accent transition-colors duration-hover">
                  Service Rates
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors duration-hover">
                  Get In Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-white">
              Office Details
            </h4>
            <div className="space-y-2 text-xs text-[#B2ABA0] leading-relaxed">
              <p>
                Hillsborough Road, Hillsborough 1042<br />
                Auckland, New Zealand
              </p>
              <p>
                Email: <span className="text-white hover:text-accent transition-colors">{contactEmail}</span><br />
                Phone: <span className="text-white hover:text-accent transition-colors">{contactPhone}</span>
              </p>
            </div>
          </div>

          {/* Business Hours Column */}
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-white">
              Hours of Operation
            </h4>
            <div className="space-y-2 text-xs text-[#B2ABA0] leading-relaxed">
              <p>
                Monday - Saturday: 08:00 AM - 06:00 PM
              </p>
              <p>
                Sunday: Closed
              </p>
              <p className="text-[10px] text-accent font-semibold pt-1">
                Booking updates processed daily.
              </p>
            </div>
          </div>
        </div>

        {/* Lower Footer */}
        <div className="border-t border-[#2D3835] pt-8 flex flex-col md:flex-row justify-between items-center text-[11px] text-[#B2ABA0] gap-4">
          <p>© {currentYear} PureSweep Cleaning. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/admin/dashboard" className="hover:text-white transition-colors">
              Console Admin Login
            </Link>
            <span className="text-[#2D3835]">|</span>
            <p>Auckland Central & West Region</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
