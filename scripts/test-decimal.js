require('dotenv').config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const staff = await prisma.staff.findMany({
    include: { user: true },
  });
  if (staff.length > 0) {
    console.log("Original staff[0] hourlyRate:", typeof staff[0]?.hourlyRate, staff[0]?.hourlyRate?.constructor?.name, staff[0]?.hourlyRate);
    const serialized = JSON.parse(JSON.stringify(staff));
    console.log("Serialized staff[0] hourlyRate:", typeof serialized[0]?.hourlyRate, serialized[0]?.hourlyRate?.constructor?.name, serialized[0]?.hourlyRate);
  } else {
    console.log("No staff members found in database.");
  }
  await prisma.$disconnect();
  await pool.end();
}

main();
