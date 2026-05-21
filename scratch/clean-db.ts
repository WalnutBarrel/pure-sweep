import { config } from "dotenv";
config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Cleaning database...");

  // Delete records in order of relationship dependency
  await prisma.activityLog.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.invoiceItem.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.staffBookings.deleteMany({});
  await prisma.bookingItem.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.staff.deleteMany({});
  await prisma.contactMessage.deleteMany({});
  await prisma.testimonial.deleteMany({});
  
  // Delete users except the admin (who has role OWNER)
  await prisma.user.deleteMany({
    where: {
      role: {
        not: "OWNER"
      }
    }
  });

  console.log("Database cleaned. Kept Users (Owner), Services, PricingPlans, and Settings.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
