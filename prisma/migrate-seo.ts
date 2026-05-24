import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required to run seed script.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const seoSettings = [
      { key: "seo_home_title", value: "PureSweep Cleaning | Premium Cleaning Services in Auckland", description: "Homepage Title" },
      { key: "seo_home_desc", value: "Refined residential, commercial, deep, carpet, and move-in/move-out cleaning services in Auckland, New Zealand. Experience an immaculate, bespoke cleaning service.", description: "Homepage Description" },
      { key: "seo_about_title", value: "About Us | PureSweep Cleaning Auckland", description: "About Page Title" },
      { key: "seo_about_desc", value: "Learn about PureSweep Cleaning, Auckland's most trusted premium cleaning team. We deliver meticulous, reliable, and tailored cleaning solutions.", description: "About Page Description" },
      { key: "seo_services_title", value: "Our Services | PureSweep Cleaning Auckland", description: "Services Page Title" },
      { key: "seo_services_desc", value: "Explore our range of premium cleaning services including residential, commercial, deep cleaning, carpet cleaning, and move-in/move-out cleans in Auckland.", description: "Services Page Description" },
      { key: "seo_pricing_title", value: "Transparent Pricing | PureSweep Cleaning", description: "Pricing Page Title" },
      { key: "seo_pricing_desc", value: "View our clear, upfront pricing for residential, commercial, and specialized cleaning services across Auckland. No hidden fees.", description: "Pricing Page Description" },
      { key: "seo_contact_title", value: "Contact Us | PureSweep Cleaning Auckland", description: "Contact Page Title" },
      { key: "seo_contact_desc", value: "Get in touch with PureSweep Cleaning. Request a custom quote, ask a question, or reach out to our Auckland team.", description: "Contact Page Description" },
      { key: "seo_book_title", value: "Book a Cleaning | PureSweep Auckland", description: "Booking Page Title" },
      { key: "seo_book_desc", value: "Schedule your next premium clean with PureSweep. Fast, easy, and secure online booking for Auckland residents and businesses.", description: "Booking Page Description" }
  ];

  for (const setting of seoSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  
  console.log("SEO settings migrated successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
