import { PrismaClient, BookingStatus, PaymentStatus, UserRole, ExpenseCategory } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required to run seed script.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Cleaning database tables before seeding...");

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
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.pricingPlan.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.contactMessage.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.setting.deleteMany({});

  console.log("Database cleaned. Seeding services...");

  // 1. Create Core Services (Prices as Decimal strings/numbers)
  const servicesData = [
    {
      name: "Residential Cleaning",
      slug: "residential-cleaning",
      description: "A refined residential cleaning tailored to your lifestyle. We dust, vacuum, mop, and sanitize your space to create a serene environment.",
      basePrice: 40.00,
      priceType: "HOURLY",
      priceDescription: "$40 + GST / hour",
      category: "Residential",
      features: [
        "Kitchen Counter Polishing",
        "Bathrooms & Toilet Scrubbing",
        "Dusting & Cobweb Sweeping",
        "Floor Mopping & Vacuuming",
        "Emptying waste bins",
      ],
      isActive: true,
    },
    {
      name: "Commercial Cleaning",
      slug: "commercial-cleaning",
      description: "Hygienic workspace maintenance for boardrooms, shared desks, staff kitchens, and reception spaces in corporate offices.",
      basePrice: 45.00,
      priceType: "HOURLY",
      priceDescription: "$45 + GST / hour",
      category: "Commercial",
      features: [
        "Office desks & workspaces sanitization",
        "Common meeting area upkeep",
        "Breakroom and kitchen cleaning",
        "Restroom sanitation & refill checks",
        "High-touch surface disinfection",
      ],
      isActive: true,
    },
    {
      name: "Carpet Cleaning",
      slug: "carpet-cleaning",
      description: "Professional steam extraction carpet cleaning. Remove deep-seated dirt, stubborn stains, and allergens to restore freshness.",
      basePrice: 250.00,
      priceType: "FIXED",
      priceDescription: "$250 + GST flat",
      category: "Carpet",
      features: [
        "Industrial hot water extraction",
        "Pre-treatment for stains & odors",
        "High-traffic area restoration",
        "Pet hair and dander removal",
        "Quick drying processes",
      ],
      isActive: true,
    },
    {
      name: "Deep Cleaning",
      slug: "deep-cleaning",
      description: "Meticulous top-to-bottom restoration. Target hidden dust, skirting boards, air vents, and detailed oven internals.",
      basePrice: 320.00,
      priceType: "FIXED",
      priceDescription: "Starting at $320 + GST",
      category: "Deep",
      features: [
        "Skirting Board Hand-Wiping",
        "Tile Grout Line Restoration",
        "Oven Interior Polish",
        "Window Track Cleansing",
        "High light fixtures dusting",
      ],
      isActive: true,
    },
    {
      name: "Move-in / Move-out Cleaning",
      slug: "move-in-move-out-cleaning",
      description: "Comprehensive end-of-tenancy cleaning designed to secure your bond. Every corner is meticulously cleaned to property manager standards.",
      basePrice: 320.00,
      priceType: "FIXED",
      priceDescription: "Starting at $320 + GST",
      category: "Move-in-out",
      features: [
        "Inside pantry & drawer dusting",
        "Oven & rangehood grease cleaning",
        "Light switch & powerpoint wiping",
        "Full dust and vacuum cycle",
        "Shower & bath scale removal",
      ],
      isActive: true,
    },
    {
      name: "Post-Construction Cleaning",
      slug: "post-construction-cleaning",
      description: "Detailed post-renovation and builders cleaning. We eliminate plaster dust, paint splatters, and debris, leaving your new build ready to occupy.",
      basePrice: 400.00,
      priceType: "FIXED",
      priceDescription: "Starting at $400 + GST",
      category: "Post-Construction",
      features: [
        "Plaster dust microfiber wiping",
        "Window paint & tape removal",
        "Cabinet interior vacuuming",
        "Hardware and glass polishing",
        "Floor scrub & polish",
      ],
      isActive: true,
    },
  ];

  const seededServices: Record<string, any> = {};
  for (const s of servicesData) {
    const service = await prisma.service.create({ data: s });
    seededServices[s.slug] = service;
    console.log(`Service created: ${service.name}`);
  }

  // 2. Create Pricing Plans for specific services
  const pricingPlans = [
    {
      serviceId: seededServices["residential-cleaning"].id,
      name: "2-Bedroom Home Package",
      price: 320.00,
      description: "Fixed price care for small houses and apartments.",
      features: ["Full kitchen sanitization", "Up to 2 bathrooms scrubbed", "Vacuuming & mopping", "Standard dust and wipe"],
    },
    {
      serviceId: seededServices["residential-cleaning"].id,
      name: "3-Bedroom Home Package",
      price: 400.00,
      description: "Perfect layout package for growing Auckland families.",
      features: ["Includes 2 full bathrooms", "Detailed vacuuming and dusting", "Bed making & surface wipe", "Travel covered"],
    },
    {
      serviceId: seededServices["carpet-cleaning"].id,
      name: "Carpet Clean Add-on",
      price: 250.00,
      description: "Steam extraction treatment for carpets.",
      features: ["2 bedrooms steam cleaned", "High suction extraction", "Pet odor neutralization", "Quick-dry process"],
    },
  ];

  for (const plan of pricingPlans) {
    await prisma.pricingPlan.create({ data: plan });
  }
  console.log("Pricing plans seeded.");

  // 3. Create Users
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  // Owner
  const ownerUser = await prisma.user.create({
    data: {
      email: "contact.puresweep@gmail.com",
      name: "PureSweep Admin",
      password: hashedPassword,
      role: UserRole.OWNER,
    },
  });

  // Staff (Cleaner)
  const staffUser = await prisma.user.create({
    data: {
      email: "cleaner.sam@gmail.com",
      name: "Sam Taylor",
      password: hashedPassword,
      role: UserRole.STAFF,
    },
  });

  // Customers
  const customerUser1 = await prisma.user.create({
    data: {
      email: "client.grace@gmail.com",
      name: "Grace Thompson",
      password: hashedPassword,
      role: UserRole.CUSTOMER,
    },
  });

  const customerUser2 = await prisma.user.create({
    data: {
      email: "david@vanceconstruction.co.nz",
      name: "David Vance",
      password: hashedPassword,
      role: UserRole.CUSTOMER,
    },
  });

  console.log("Users created.");

  // 4. Create Staff profile
  const staffProfile = await prisma.staff.create({
    data: {
      userId: staffUser.id,
      firstName: "Sam",
      lastName: "Taylor",
      phone: "021-999-888",
      hourlyRate: 25.00,
      isActive: true,
    },
  });
  console.log("Staff profiles seeded.");

  // 5. Create Customer profiles
  const customer1 = await prisma.customer.create({
    data: {
      userId: customerUser1.id,
      name: "Grace Thompson",
      email: "client.grace@gmail.com",
      phone: "021-111-222",
      address: "105 Remuera Road",
      suburb: "Remuera",
      notes: "Architectural home with marble kitchen benchtops. Needs non-acidic cleaners.",
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      userId: customerUser2.id,
      name: "David Vance",
      email: "david@vanceconstruction.co.nz",
      phone: "027-456123-90",
      address: "12 Queen Street",
      suburb: "Auckland CBD",
      notes: "Corporate commercial office. Key in lockbox #543.",
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      name: "Richard Hadlee",
      email: "richard@apexlegal.co.nz",
      phone: "022-777-666",
      address: "42 College Hill",
      suburb: "Ponsonby",
    },
  });
  console.log("Customer profiles seeded.");

  // 6. Seed System configurations / Settings
  await prisma.setting.createMany({
    data: [
      { key: "gst_rate", value: "0.15", description: "New Zealand Goods & Services Tax (15%)" },
      { key: "contact_email", value: "contact.puresweep@gmail.com", description: "Main customer contact address" },
      { key: "contact_phone", value: "021-026999-56", description: "Main office phone number" },
      
      // SEO Metadata Settings
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
      { key: "seo_book_desc", value: "Schedule your next premium clean with PureSweep. Fast, easy, and secure online booking for Auckland residents and businesses.", description: "Booking Page Description" },
    ],
  });
  console.log("Settings seeded.");

  // 7. Seed realistic Bookings, BookingItems, Invoices, Payments, and Staff assignments

  // Booking 1: Completed Residential Clean (Grace Thompson)
  const preferredDate1 = new Date();
  preferredDate1.setDate(preferredDate1.getDate() - 5); // 5 days ago

  const booking1 = await prisma.booking.create({
    data: {
      bookingRef: "PS-2026-1001",
      customerId: customer1.id,
      preferredDate: preferredDate1,
      preferredTime: "Morning",
      status: BookingStatus.COMPLETED,
      notes: "Do not scratch kitchen marble. Regular sweep and dust.",
      totalPrice: 160.00, // 4 hours @ $40
      gstAmount: 24.00,   // 15% GST
      grandTotal: 184.00,
    },
  });

  await prisma.bookingItem.create({
    data: {
      bookingId: booking1.id,
      serviceId: seededServices["residential-cleaning"].id,
      serviceName: seededServices["residential-cleaning"].name,
      quantity: 4,
      unitPrice: 40.00,
      totalPrice: 160.00,
    },
  });

  // Assign staff Sam to booking 1
  await prisma.staffBookings.create({
    data: {
      staffId: staffProfile.id,
      bookingId: booking1.id,
    },
  });

  // Invoice for booking 1 (Paid)
  const invoice1 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-1001",
      bookingId: booking1.id,
      customerId: customer1.id,
      issueDate: preferredDate1,
      dueDate: preferredDate1,
      status: PaymentStatus.PAID,
      subtotal: 160.00,
      gstAmount: 24.00,
      totalAmount: 184.00,
    },
  });

  await prisma.invoiceItem.create({
    data: {
      invoiceId: invoice1.id,
      description: "Residential Cleaning - 4 Hours",
      quantity: 4,
      unitPrice: 40.00,
      totalPrice: 160.00,
    },
  });

  // Payment for invoice 1
  await prisma.payment.create({
    data: {
      invoiceId: invoice1.id,
      amount: 184.00,
      paymentDate: preferredDate1,
      paymentMethod: "BANK_TRANSFER",
      transactionRef: "POLI-TXN-8877",
      status: PaymentStatus.PAID,
    },
  });

  // Booking 2: Confirmed Deep Clean + Oven clean add-on (Richard Hadlee)
  const preferredDate2 = new Date();
  preferredDate2.setDate(preferredDate2.getDate() + 3); // 3 days in the future

  const booking2 = await prisma.booking.create({
    data: {
      bookingRef: "PS-2026-1002",
      customerId: customer3.id,
      preferredDate: preferredDate2,
      preferredTime: "Morning",
      status: BookingStatus.CONFIRMED,
      notes: "Ponsonby townhouse. Needs oven deep clean.",
      totalPrice: 387.00, // Base deep clean 320 + oven clean add-on 67
      gstAmount: 58.05,
      grandTotal: 445.05,
    },
  });

  await prisma.bookingItem.createMany({
    data: [
      {
        bookingId: booking2.id,
        serviceId: seededServices["deep-cleaning"].id,
        serviceName: seededServices["deep-cleaning"].name,
        quantity: 1,
        unitPrice: 320.00,
        totalPrice: 320.00,
      },
      {
        bookingId: booking2.id,
        serviceId: seededServices["deep-cleaning"].id, // using deep cleaning ID for details
        serviceName: "Oven Deep Clean Add-On",
        quantity: 1,
        unitPrice: 67.00,
        totalPrice: 67.00,
      },
    ],
  });

  // Assign staff Sam to booking 2
  await prisma.staffBookings.create({
    data: {
      staffId: staffProfile.id,
      bookingId: booking2.id,
    },
  });

  // Invoice for booking 2 (Unpaid)
  const invoice2 = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-1002",
      bookingId: booking2.id,
      customerId: customer3.id,
      issueDate: new Date(),
      dueDate: preferredDate2,
      status: PaymentStatus.UNPAID,
      subtotal: 387.00,
      gstAmount: 58.05,
      totalAmount: 445.05,
    },
  });

  await prisma.invoiceItem.createMany({
    data: [
      { invoiceId: invoice2.id, description: "PureSweep Deep Clean Package", quantity: 1, unitPrice: 320.00, totalPrice: 320.00 },
      { invoiceId: invoice2.id, description: "Oven Deep Clean Add-On", quantity: 1, unitPrice: 67.00, totalPrice: 67.00 },
    ],
  });

  // Booking 3: In Progress Commercial Clean (David Vance)
  const preferredDate3 = new Date(); // Today

  const booking3 = await prisma.booking.create({
    data: {
      bookingRef: "PS-2026-1003",
      customerId: customer2.id,
      preferredDate: preferredDate3,
      preferredTime: "Afternoon",
      status: BookingStatus.IN_PROGRESS,
      notes: "Ensure office desks are completely wiped with alcohol spray.",
      totalPrice: 450.00, // 10 hours @ $45
      gstAmount: 67.50,
      grandTotal: 517.50,
    },
  });

  await prisma.bookingItem.create({
    data: {
      bookingId: booking3.id,
      serviceId: seededServices["commercial-cleaning"].id,
      serviceName: seededServices["commercial-cleaning"].name,
      quantity: 10,
      unitPrice: 450.00, // total for quantity block
      totalPrice: 450.00,
    },
  });

  console.log("Bookings, Invoices, and Payments seeded.");

  // 8. Seed Expenses
  const expDate1 = new Date();
  expDate1.setDate(expDate1.getDate() - 10);
  const expDate2 = new Date();
  expDate2.setDate(expDate2.getDate() - 2);

  await prisma.expense.createMany({
    data: [
      {
        category: ExpenseCategory.SUPPLIES,
        amount: 85.00,
        gstAmount: 12.75,
        date: expDate1,
        description: "Bunnings Auckland - Microfiber cleaning cloths & eco-detergents",
        recipient: "Bunnings Warehouse",
      },
      {
        category: ExpenseCategory.TRAVEL,
        amount: 50.00,
        gstAmount: 7.50,
        date: expDate2,
        description: "Z Energy Hillsborough - Fuel refill for service van",
        recipient: "Z Energy",
      },
      {
        category: ExpenseCategory.SALARY,
        amount: 100.00,
        gstAmount: 0.00, // Wages do not carry GST
        date: expDate2,
        description: "Sam Taylor - Wages for Grace Thompson clean (4hrs)",
        recipient: "Sam Taylor",
      },
    ],
  });
  console.log("Expenses seeded.");

  // 9. Seed Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        quote: "PureSweep has cleaned our commercial offices in central Auckland for the past year. Their workmanship is consistent, and the supervisors are always responsive to our schedule requirements.",
        author: "Richard Hadlee",
        role: "Director, Apex Legal",
        location: "Ponsonby, Auckland",
        rating: 5,
        isApproved: true,
      },
      {
        quote: "The deep clean team did an exceptional job restoring the marble benchtops and oven in our newly renovated home. Very thorough, professional, and trustworthy operators.",
        author: "Grace Thompson",
        role: "Homeowner",
        location: "Remuera, Auckland",
        rating: 5,
        isApproved: true,
      },
      {
        quote: "Excellent residential cleaning standard. The pricing estimator made booking straightforward, and the team arrived exactly on time. Highly recommended for Auckland busy professionals.",
        author: "David Lomas",
        role: "Property Manager",
        location: "Epsom, Auckland",
        rating: 5,
        isApproved: true,
      },
    ],
  });
  console.log("Testimonials seeded.");

  // 10. Seed Contact Messages
  await prisma.contactMessage.createMany({
    data: [
      {
        name: "Jane Miller",
        email: "jane.miller@hotmail.com",
        phone: "021-333-444",
        subject: "Weekly cleaning for Remuera house",
        message: "Hello, I am looking for a regular weekly cleaner for my 4 bedroom home. Please let me know your availability for weekly morning slots.",
        status: "NEW",
      },
      {
        name: "Liam O'Connor",
        email: "liam@oconnorgroup.nz",
        phone: "027-112-233",
        subject: "Office cleaning quote request",
        message: "Hi there, we have a small 80 sqm office in Grey Lynn and need regular vacuuming and rubbish removal twice a week. Could you provide an estimate?",
        status: "READ",
      },
    ],
  });
  console.log("Contact messages seeded.");

  // 11. Seed Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        userId: ownerUser.id,
        action: "USER_LOGIN",
        details: "Owner logged in to the dashboard.",
        ipAddress: "122.56.24.12",
      },
      {
        userId: ownerUser.id,
        action: "UPDATE_SYSTEM_SETTINGS",
        details: "GST rate setting confirmed at 15%.",
        ipAddress: "122.56.24.12",
      },
      {
        userId: ownerUser.id,
        action: "CREATE_BOOKING",
        details: "Booking PS-2026-1002 manually created for customer Richard Hadlee.",
        ipAddress: "122.56.24.12",
      },
    ],
  });
  console.log("Activity logs seeded.");

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
