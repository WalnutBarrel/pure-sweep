import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
  const email = "contact.puresweep@gmail.com";
  const password = "Password123!";
  
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    console.log("User not found!");
    return;
  }
  
  console.log("User found:", user.email);
  const match = await bcrypt.compare(password, user.password!);
  console.log("Password match:", match);
  console.log("Role:", user.role);
}

test().finally(() => prisma.$disconnect());
