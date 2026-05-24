import bcrypt from "bcryptjs";

// Generate a valid bcrypt hash at module load so bcrypt.compare works
const DEFAULT_HASH = bcrypt.hashSync("Password123!", 10);

// Local in-memory store representing database tables
export const db: Record<string, any[]> = {
  users: [
    {
      id: "owner-1",
      name: "PureSweep Admin",
      email: "contact.puresweep@gmail.com",
      password: DEFAULT_HASH,
      role: "OWNER",
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    },
    {
      id: "staff-1",
      name: "Sam Taylor",
      email: "cleaner.sam@gmail.com",
      password: DEFAULT_HASH,
      role: "STAFF",
      createdAt: new Date("2026-01-02"),
      updatedAt: new Date("2026-01-02"),
    },
    {
      id: "customer-1",
      name: "Grace Thompson",
      email: "client.grace@gmail.com",
      password: DEFAULT_HASH,
      role: "CUSTOMER",
      createdAt: new Date("2026-01-03"),
      updatedAt: new Date("2026-01-03"),
    },
    {
      id: "customer-2",
      name: "David Vance",
      email: "david@vanceconstruction.co.nz",
      password: DEFAULT_HASH,
      role: "CUSTOMER",
      createdAt: new Date("2026-01-04"),
      updatedAt: new Date("2026-01-04"),
    },
  ],
  services: [
    {
      id: "service-1",
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
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    },
    {
      id: "service-2",
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
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    },
    {
      id: "service-3",
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
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    },
    {
      id: "service-4",
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
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    },
    {
      id: "service-5",
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
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    },
    {
      id: "service-6",
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
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    },
  ],
  pricingPlans: [
    {
      id: "plan-1",
      serviceId: "service-1",
      name: "2-Bedroom Home Package",
      price: 320.00,
      description: "Fixed price care for small houses and apartments.",
      features: ["Full kitchen sanitization", "Up to 2 bathrooms scrubbed", "Vacuuming & mopping", "Standard dust and wipe"],
      isActive: true,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    },
    {
      id: "plan-2",
      serviceId: "service-1",
      name: "3-Bedroom Home Package",
      price: 400.00,
      description: "Perfect layout package for growing Auckland families.",
      features: ["Includes 2 full bathrooms", "Detailed vacuuming and dusting", "Bed making & surface wipe", "Travel covered"],
      isActive: true,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    },
    {
      id: "plan-3",
      serviceId: "service-3",
      name: "Carpet Clean Add-on",
      price: 250.00,
      description: "Steam extraction treatment for carpets.",
      features: ["2 bedrooms steam cleaned", "High suction extraction", "Pet odor neutralization", "Quick-dry process"],
      isActive: true,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    },
  ],
  staff: [
    {
      id: "staff-profile-1",
      userId: "staff-1",
      firstName: "Sam",
      lastName: "Taylor",
      phone: "021-999-888",
      hourlyRate: 25.00,
      isActive: true,
      createdAt: new Date("2026-01-02"),
      updatedAt: new Date("2026-01-02"),
    },
  ],
  customers: [
    {
      id: "customer-profile-1",
      userId: "customer-1",
      name: "Grace Thompson",
      email: "client.grace@gmail.com",
      phone: "021-111-222",
      address: "105 Remuera Road",
      suburb: "Remuera",
      notes: "Architectural home with marble kitchen benchtops. Needs non-acidic cleaners.",
      createdAt: new Date("2026-01-03"),
      updatedAt: new Date("2026-01-03"),
    },
    {
      id: "customer-profile-2",
      userId: "customer-2",
      name: "David Vance",
      email: "david@vanceconstruction.co.nz",
      phone: "027-456123-90",
      address: "12 Queen Street",
      suburb: "Auckland CBD",
      notes: "Corporate commercial office. Key in lockbox #543.",
      createdAt: new Date("2026-01-04"),
      updatedAt: new Date("2026-01-04"),
    },
    {
      id: "customer-profile-3",
      userId: null,
      name: "Richard Hadlee",
      email: "richard@apexlegal.co.nz",
      phone: "022-777-666",
      address: "42 College Hill",
      suburb: "Ponsonby",
      notes: "",
      createdAt: new Date("2026-01-05"),
      updatedAt: new Date("2026-01-05"),
    },
  ],
  bookings: [
    {
      id: "booking-1",
      bookingRef: "PS-2026-1001",
      customerId: "customer-profile-1",
      preferredDate: new Date(new Date().setDate(new Date().getDate() - 5)),
      preferredTime: "Morning",
      status: "COMPLETED",
      notes: "Do not scratch kitchen marble. Regular sweep and dust.",
      totalPrice: 160.00,
      gstAmount: 24.00,
      grandTotal: 184.00,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
      updatedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    },
    {
      id: "booking-2",
      bookingRef: "PS-2026-1002",
      customerId: "customer-profile-3",
      preferredDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      preferredTime: "Morning",
      status: "CONFIRMED",
      notes: "Ponsonby townhouse. Needs oven deep clean.",
      totalPrice: 387.00,
      gstAmount: 58.05,
      grandTotal: 445.05,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
      updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
    {
      id: "booking-3",
      bookingRef: "PS-2026-1003",
      customerId: "customer-profile-2",
      preferredDate: new Date(),
      preferredTime: "Afternoon",
      status: "IN_PROGRESS",
      notes: "Ensure office desks are completely wiped with alcohol spray.",
      totalPrice: 450.00,
      gstAmount: 67.50,
      grandTotal: 517.50,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  bookingItems: [
    {
      id: "item-1",
      bookingId: "booking-1",
      serviceId: "service-1",
      serviceName: "Residential Cleaning",
      quantity: 4,
      unitPrice: 40.00,
      totalPrice: 160.00,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "item-2",
      bookingId: "booking-2",
      serviceId: "service-4",
      serviceName: "Deep Cleaning",
      quantity: 1,
      unitPrice: 320.00,
      totalPrice: 320.00,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "item-3",
      bookingId: "booking-2",
      serviceId: "service-4",
      serviceName: "Oven Deep Clean Add-On",
      quantity: 1,
      unitPrice: 67.00,
      totalPrice: 67.00,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "item-4",
      bookingId: "booking-3",
      serviceId: "service-2",
      serviceName: "Commercial Cleaning",
      quantity: 10,
      unitPrice: 450.00,
      totalPrice: 450.00,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  staffBookings: [
    {
      staffId: "staff-profile-1",
      bookingId: "booking-1",
      assignedAt: new Date(),
    },
    {
      staffId: "staff-profile-1",
      bookingId: "booking-2",
      assignedAt: new Date(),
    },
  ],
  invoices: [
    {
      id: "invoice-1",
      invoiceNumber: "INV-2026-1001",
      bookingId: "booking-1",
      customerId: "customer-profile-1",
      issueDate: new Date(new Date().setDate(new Date().getDate() - 5)),
      dueDate: new Date(new Date().setDate(new Date().getDate() - 5)),
      status: "PAID",
      subtotal: 160.00,
      gstAmount: 24.00,
      totalAmount: 184.00,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
      updatedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    },
    {
      id: "invoice-2",
      invoiceNumber: "INV-2026-1002",
      bookingId: "booking-2",
      customerId: "customer-profile-3",
      issueDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      status: "UNPAID",
      subtotal: 387.00,
      gstAmount: 58.05,
      totalAmount: 445.05,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  invoiceItems: [
    {
      id: "inv-item-1",
      invoiceId: "invoice-1",
      description: "Residential Cleaning - 4 Hours",
      quantity: 4,
      unitPrice: 40.00,
      totalPrice: 160.00,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "inv-item-2",
      invoiceId: "invoice-2",
      description: "PureSweep Deep Clean Package",
      quantity: 1,
      unitPrice: 320.00,
      totalPrice: 320.00,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "inv-item-3",
      invoiceId: "invoice-2",
      description: "Oven Deep Clean Add-On",
      quantity: 1,
      unitPrice: 67.00,
      totalPrice: 67.00,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  payments: [
    {
      id: "pay-1",
      invoiceId: "invoice-1",
      amount: 184.00,
      paymentDate: new Date(new Date().setDate(new Date().getDate() - 5)),
      paymentMethod: "BANK_TRANSFER",
      transactionRef: "POLI-TXN-8877",
      status: "PAID",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  expenses: [
    {
      id: "exp-1",
      category: "SUPPLIES",
      amount: 85.00,
      gstAmount: 12.75,
      date: new Date(new Date().setDate(new Date().getDate() - 10)),
      description: "Bunnings Auckland - Microfiber cleaning cloths & eco-detergents",
      recipient: "Bunnings Warehouse",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "exp-2",
      category: "TRAVEL",
      amount: 50.00,
      gstAmount: 7.50,
      date: new Date(new Date().setDate(new Date().getDate() - 2)),
      description: "Z Energy Hillsborough - Fuel refill for service van",
      recipient: "Z Energy",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "exp-3",
      category: "SALARY",
      amount: 100.00,
      gstAmount: 0.00,
      date: new Date(new Date().setDate(new Date().getDate() - 2)),
      description: "Sam Taylor - Wages for Grace Thompson clean (4hrs)",
      recipient: "Sam Taylor",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  contactMessages: [
    {
      id: "msg-1",
      name: "Jane Miller",
      email: "jane.miller@hotmail.com",
      phone: "021-333-444",
      subject: "Weekly cleaning for Remuera house",
      message: "Hello, I am looking for a regular weekly cleaner for my 4 bedroom home. Please let me know your availability for weekly morning slots.",
      status: "NEW",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "msg-2",
      name: "Liam O'Connor",
      email: "liam@oconnorgroup.nz",
      phone: "027-112-233",
      subject: "Office cleaning quote request",
      message: "Hi there, we have a small 80 sqm office in Grey Lynn and need regular vacuuming and rubbish removal twice a week. Could you provide an estimate?",
      status: "READ",
      createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
      updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
  ],
  testimonials: [
    {
      id: "t-1",
      quote: "PureSweep has cleaned our commercial offices in central Auckland for the past year. Their workmanship is consistent, and the supervisors are always responsive to our schedule requirements.",
      author: "Richard Hadlee",
      role: "Director, Apex Legal",
      location: "Ponsonby, Auckland",
      rating: 5,
      isApproved: true,
      createdAt: new Date(),
    },
    {
      id: "t-2",
      quote: "The deep clean team did an exceptional job restoring the marble benchtops and oven in our newly renovated home. Very thorough, professional, and trustworthy operators.",
      author: "Grace Thompson",
      role: "Homeowner",
      location: "Remuera, Auckland",
      rating: 5,
      isApproved: true,
      createdAt: new Date(),
    },
    {
      id: "t-3",
      quote: "Excellent residential cleaning standard. The pricing estimator made booking straightforward, and the team arrived exactly on time. Highly recommended for Auckland busy professionals.",
      author: "David Lomas",
      role: "Property Manager",
      location: "Epsom, Auckland",
      rating: 5,
      isApproved: true,
      createdAt: new Date(),
    },
  ],
  settings: [
    { id: "s-1", key: "gst_rate", value: "0.15", description: "New Zealand Goods & Services Tax (15%)", updatedAt: new Date() },
    { id: "s-2", key: "contact_email", value: "contact.puresweep@gmail.com", description: "Main customer contact address", updatedAt: new Date() },
    { id: "s-3", key: "contact_phone", value: "021-026999-56", description: "Main office phone number", updatedAt: new Date() },
  ],
  activityLogs: [
    {
      id: "log-1",
      userId: "owner-1",
      action: "USER_LOGIN",
      details: "Owner logged in to the dashboard.",
      ipAddress: "122.56.24.12",
      createdAt: new Date(),
    },
    {
      id: "log-2",
      userId: "owner-1",
      action: "UPDATE_SYSTEM_SETTINGS",
      details: "GST rate setting confirmed at 15%.",
      ipAddress: "122.56.24.12",
      createdAt: new Date(),
    },
  ]
};

// Map Prisma model names to our database keys
const modelToDbKey = (model: string): string => {
  const m = model.toLowerCase();
  if (m === "pricingplan") return "pricingPlans";
  if (m === "bookingitem") return "bookingItems";
  if (m === "staffbookings") return "staffBookings";
  if (m === "invoiceitem") return "invoiceItems";
  if (m === "contactmessage") return "contactMessages";
  if (m === "activitylog") return "activityLogs";
  
  if (m.endsWith("y")) return m.slice(0, -1) + "ies";
  return m + "s";
};

// Filter dynamic helper
const filterRecord = (record: any, where: any): boolean => {
  if (!where) return true;
  for (const key in where) {
    const condition = where[key];
    if (condition === undefined) continue;
    
    if (typeof condition === "object" && condition !== null) {
      if (condition instanceof Date) {
        if (new Date(record[key]).getTime() !== condition.getTime()) return false;
      } else if ("gte" in condition || "lte" in condition || "gt" in condition || "lt" in condition) {
        const val = new Date(record[key]).getTime();
        if ("gte" in condition && val < new Date(condition.gte).getTime()) return false;
        if ("lte" in condition && val > new Date(condition.lte).getTime()) return false;
        if ("gt" in condition && val <= new Date(condition.gt).getTime()) return false;
        if ("lt" in condition && val >= new Date(condition.lt).getTime()) return false;
      } else if ("equals" in condition) {
        if (record[key] !== condition.equals) return false;
      } else if ("in" in condition) {
        if (!Array.isArray(condition.in) || !condition.in.includes(record[key])) return false;
      } else if ("not" in condition) {
        if (record[key] === condition.not) return false;
      } else {
        // Nested relation filters
        // Simple mock matching for common ones e.g. staffProfile, customerProfile, etc.
        const nestedField = record[key];
        if (!nestedField) return false;
      }
    } else {
      if (record[key] !== condition) return false;
    }
  }
  return true;
};

// Sorting dynamic helper
const sortRecords = (records: any[], orderBy: any) => {
  if (!orderBy) return records;
  const sortParams = Array.isArray(orderBy) ? orderBy : [orderBy];
  return [...records].sort((a, b) => {
    for (const param of sortParams) {
      const key = Object.keys(param)[0];
      const dir = param[key];
      const valA = a[key];
      const valB = b[key];
      if (valA === valB) continue;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      if (typeof valA === "string" && typeof valB === "string") {
        return dir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return dir === "asc" 
        ? (valA < valB ? -1 : 1) 
        : (valA > valB ? -1 : 1);
    }
    return 0;
  });
};

// Relation population helper
const populateIncludes = (modelName: string, record: any, include: any): any => {
  if (!include) return record;
  const copy = { ...record };
  const m = modelName.toLowerCase();
  
  for (const key in include) {
    if (include[key]) {
      if (key === "customer" && "customerId" in record) {
        copy.customer = db.customers.find((c) => c.id === record.customerId);
      } else if (key === "booking" && "bookingId" in record) {
        copy.booking = db.bookings.find((b) => b.id === record.bookingId);
      } else if (key === "bookingItems" && m === "booking") {
        copy.bookingItems = db.bookingItems.filter((item) => item.bookingId === record.id);
      } else if (key === "staffBookings" && m === "booking") {
        copy.staffBookings = db.staffBookings.filter((sb) => sb.bookingId === record.id);
      } else if (key === "staff" && m === "staffbookings") {
        copy.staff = db.staff.find((s) => s.id === record.staffId);
      } else if (key === "user" && "userId" in record) {
        copy.user = db.users.find((u) => u.id === record.userId);
      } else if (key === "staffProfile" && m === "user") {
        copy.staffProfile = db.staff.find((s) => s.userId === record.id);
      } else if (key === "customerProfile" && m === "user") {
        copy.customerProfile = db.customers.find((c) => c.userId === record.id);
      } else if (key === "invoiceItems" && m === "invoice") {
        copy.invoiceItems = db.invoiceItems.filter((item) => item.invoiceId === record.id);
      } else if (key === "payments" && m === "invoice") {
        copy.payments = db.payments.filter((p) => p.invoiceId === record.id);
      }
      
      // Handle service -> pricingPlans
      if (key === "pricingPlans" && m === "service") {
        copy.pricingPlans = db.pricingPlans.filter((p) => p.serviceId === record.id);
      }
      // Handle pricingPlan -> service
      if (key === "service" && "serviceId" in record) {
        copy.service = db.services.find((s) => s.id === record.serviceId);
      }
      // Handle invoice -> booking
      if (key === "invoice" && "invoiceId" in record) {
        copy.invoice = db.invoices.find((inv) => inv.id === record.invoiceId);
      }

      // Handle _count includes (e.g. customer._count.bookings)
      if (key === "_count" && typeof include[key] === "object" && include[key]?.select) {
        const countSelect = include[key].select;
        copy._count = {};
        if (countSelect.bookings) {
          copy._count.bookings = db.bookings.filter((b) => b.customerId === record.id).length;
        }
        if (countSelect.invoices) {
          copy._count.invoices = db.invoices.filter((inv) => inv.customerId === record.id).length;
        }
        if (countSelect.staffBookings) {
          copy._count.staffBookings = db.staffBookings.filter((sb) => sb.staffId === record.id).length;
        }
      }

      // Handle nested includes
      if (typeof include[key] === "object" && include[key]?.include) {
        if (Array.isArray(copy[key])) {
          copy[key] = copy[key].map((item: any) => populateIncludes(key, item, include[key].include));
        } else if (copy[key]) {
          copy[key] = populateIncludes(key, copy[key], include[key].include);
        }
      }
    }
  }
  return copy;
};

// Apply a select clause – only keep requested fields
const applySelect = (record: any, select: any): any => {
  if (!select) return record;
  const result: Record<string, any> = {};
  for (const key in select) {
    if (select[key]) {
      result[key] = record[key];
    }
  }
  return result;
};

// Core Mock Engine matching Prisma methods
export const handleMockQuery = async (modelName: string, methodName: string, args: any = {}) => {
  const dbKey = modelToDbKey(modelName);
  const table = db[dbKey] || [];
  
  switch (methodName) {
    case "findUnique":
    case "findFirst": {
      const { where, include, select } = args;
      const found = table.find((record) => filterRecord(record, where));
      if (!found) return null;
      let result = populateIncludes(modelName, found, include);
      if (select) result = applySelect(result, select);
      return result;
    }
    
    case "findMany": {
      const { where, include, orderBy, take, skip, select } = args;
      let results = table.filter((record) => filterRecord(record, where));
      results = sortRecords(results, orderBy);
      
      const start = skip || 0;
      const end = take ? start + take : results.length;
      results = results.slice(start, end);
      
      let mapped = results.map((record) => populateIncludes(modelName, record, include));
      if (select) mapped = mapped.map((record) => applySelect(record, select));
      return mapped;
    }
    
    case "count": {
      const { where } = args;
      return table.filter((record) => filterRecord(record, where)).length;
    }
    
    case "aggregate": {
      const { _sum } = args;
      const result: Record<string, any> = { _sum: {} };
      if (_sum) {
        for (const field in _sum) {
          const sumVal = table.reduce((acc, curr) => acc + Number(curr[field] || 0), 0);
          result._sum[field] = sumVal;
        }
      }
      return result;
    }
    
    case "groupBy": {
      const { by, _count, _sum } = args;
      const groups: Record<string, any[]> = {};
      
      for (const record of table) {
        const groupKey = by.map((field: string) => String(record[field])).join("::");
        if (!groups[groupKey]) groups[groupKey] = [];
        groups[groupKey].push(record);
      }
      
      return Object.entries(groups).map(([keyStr, items]) => {
        const groupFields = keyStr.split("::");
        const entry: Record<string, any> = {};
        
        by.forEach((field: string, idx: number) => {
          const val = items[0][field];
          entry[field] = typeof val === "number" ? Number(groupFields[idx]) : groupFields[idx];
        });
        
        if (_count) {
          entry._count = {};
          for (const cKey in _count) {
            entry._count[cKey] = items.length;
          }
        }
        
        if (_sum) {
          entry._sum = {};
          for (const sKey in _sum) {
            entry._sum[sKey] = items.reduce((acc, curr) => acc + Number(curr[sKey] || 0), 0);
          }
        }
        
        return entry;
      });
    }
    
    case "create": {
      const { data, include } = args;
      const newRecord = {
        id: `${modelName.toLowerCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };
      
      // Format decimals/dates if necessary
      for (const key in newRecord) {
        if (newRecord[key] instanceof Date) {
          newRecord[key] = new Date(newRecord[key]);
        }
      }
      
      table.push(newRecord);
      return populateIncludes(modelName, newRecord, include);
    }
    
    case "update": {
      const { where, data, include } = args;
      const idx = table.findIndex((record) => filterRecord(record, where));
      if (idx === -1) {
        throw new Error(`Record not found for update in model ${modelName}`);
      }
      
      table[idx] = {
        ...table[idx],
        ...data,
        updatedAt: new Date(),
      };
      
      return populateIncludes(modelName, table[idx], include);
    }
    
    case "delete": {
      const { where } = args;
      const idx = table.findIndex((record) => filterRecord(record, where));
      if (idx === -1) {
        throw new Error(`Record not found for delete in model ${modelName}`);
      }
      const deleted = table.splice(idx, 1)[0];
      return deleted;
    }
    
    case "deleteMany": {
      const { where } = args;
      let count = 0;
      if (!where || Object.keys(where).length === 0) {
        count = table.length;
        table.length = 0;
      } else {
        let i = table.length;
        while (i--) {
          if (filterRecord(table[i], where)) {
            table.splice(i, 1);
            count++;
          }
        }
      }
      return { count };
    }
    
    case "createMany": {
      const { data } = args;
      const records = Array.isArray(data) ? data : [data];
      const newRecords = records.map((d: any) => ({
        id: `${modelName.toLowerCase()}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...d,
      }));
      table.push(...newRecords);
      return { count: newRecords.length };
    }

    default:
      throw new Error(`Prisma Mock Method ${methodName} is not yet implemented.`);
  }
};
