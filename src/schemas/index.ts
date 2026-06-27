import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters long."),
});

export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Please select a service."),
  clientName: z.string().min(2, "Name must be at least 2 characters."),
  clientEmail: z.string().email("Please enter a valid email address.").optional().or(z.literal("")),
  clientPhone: z.string().min(8, "Phone number must be at least 8 characters.").regex(/^(?:\+?64|0) ?[234679](?: ?\d){6,10}$/, "Please enter a valid New Zealand phone number (e.g., 021 123 4567)."),
  address: z.string().min(5, "Please enter a complete street address."),
  suburb: z.string().min(2, "Please enter an Auckland suburb."),
  preferredDate: z.string().min(1, "Please select a preferred date."),
  preferredTime: z.string().min(1, "Please select a preferred time slot."),
  propertyType: z.string().min(1, "Please select a property type."),
  cleaningFrequency: z.string().min(1, "Please select a cleaning frequency."),
  
  // Specific room details (for residential/move-in-out/deep)
  bedrooms: z.number().int().min(1).max(10).optional(),
  bathrooms: z.number().int().min(1).max(6).optional(),
  
  // Array of extra add-on services (e.g. ["Oven Cleaning", "Carpet Steam Cleaning"])
  extraServices: z.array(z.string()).optional(),
  
  notes: z.string().max(500, "Notes cannot exceed 500 characters.").optional(),
}).refine(
  (data) => {
    if (!data.preferredDate) return true;
    const selected = new Date(data.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  },
  {
    message: "Date cannot be in the past.",
    path: ["preferredDate"],
  }
);

// Zod schemas for Admin CRUD
export const adminServiceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  basePrice: z.coerce.number().min(0, "Base price must be a positive number."),
  priceType: z.enum(["HOURLY", "FIXED", "RANGE"]),
  priceDescription: z.string().min(2, "Price description is required."),
  category: z.string().min(2, "Category is required."),
  features: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

export const adminPricingPlanSchema = z.object({
  serviceId: z.string().min(1, "Please select a service."),
  name: z.string().min(2, "Name must be at least 2 characters."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  features: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

export const adminBookingSchema = z.object({
  customerId: z.string().min(1, "Customer is required."),
  serviceId: z.string().min(1, "Service option is required."),
  preferredDate: z.string().min(1, "Preferred date is required."),
  preferredTime: z.string().min(1, "Preferred time is required."),
  status: z.enum(["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  notes: z.string().max(500, "Notes cannot exceed 500 characters.").optional().nullable(),
  totalPrice: z.coerce.number().min(0),
  gstAmount: z.coerce.number().min(0),
  grandTotal: z.coerce.number().min(0),
  assignedStaffId: z.string().optional().nullable(),
  propertyType: z.string().min(1, "Property type is required."),
  cleaningFrequency: z.string().min(1, "Cleaning frequency is required."),
}).refine(
  (data) => {
    if (!data.preferredDate) return true;
    const selected = new Date(data.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  },
  {
    message: "Preferred date cannot be in the past.",
    path: ["preferredDate"],
  }
);

export const adminCustomerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(8, "Phone number must be at least 8 characters."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  suburb: z.string().min(2, "Suburb is required."),
  notes: z.string().max(500).optional().nullable(),
});

export const adminInvoiceSchema = z.object({
  customerId: z.string().min(1, "Customer is required."),
  bookingId: z.string().min(1, "Booking is required."),
  issueDate: z.string().min(1, "Issue date is required."),
  dueDate: z.string().min(1, "Due date is required."),
  subtotal: z.coerce.number().min(0),
  gstAmount: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).default(0),
  totalAmount: z.coerce.number().min(0),
  status: z.enum(["UNPAID", "PARTIAL", "PAID", "REFUNDED"]),
});

export const adminPaymentSchema = z.object({
  invoiceId: z.string().min(1, "Invoice is required."),
  amount: z.coerce.number().min(0.01, "Amount must be greater than zero."),
  paymentDate: z.string().min(1, "Payment date is required."),
  paymentMethod: z.string().min(2, "Payment method is required."),
  transactionRef: z.string().min(2, "Transaction reference is required."),
  status: z.enum(["UNPAID", "PARTIAL", "PAID", "REFUNDED"]),
});

export const adminExpenseSchema = z.object({
  description: z.string().min(3, "Description is required."),
  category: z.enum(["SUPPLIES", "EQUIPMENT", "TRAVEL", "SALARY", "MARKETING", "OTHER"]),
  amount: z.coerce.number().min(0.01, "Amount must be greater than zero."),
  gstAmount: z.coerce.number().min(0, "GST amount must be a positive number."),
  date: z.string().min(1, "Date is required."),
  recipient: z.string().min(2, "Recipient/Vendor is required."),
  notes: z.string().max(500).optional().nullable(),
});

export const adminStaffSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  phone: z.string().min(8, "Phone number is required."),
  hourlyRate: z.coerce.number().min(0, "Hourly rate must be a positive number."),
  isActive: z.boolean().default(true),
  email: z.string().email("Please enter a valid email address.").optional().nullable(),
});

export const adminTestimonialSchema = z.object({
  quote: z.string().min(10, "Quote must be at least 10 characters."),
  author: z.string().min(2, "Author name is required."),
  role: z.string().min(2, "Role/Occupation is required."),
  location: z.string().min(2, "Location/Suburb is required."),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  isApproved: z.boolean().default(true),
});

export const adminSettingSchema = z.object({
  key: z.string().min(2, "Key is required."),
  value: z.string().min(1, "Value is required."),
  description: z.string().max(200).optional().nullable(),
});

export const adminBlogSchema = z.object({
  title: z.string().min(2, "Title is required."),
  slug: z.string().min(2, "Slug is required."),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(10, "Content is required."),
  imageUrl: z.string().url().refine(
    (url) => url.startsWith("https://puresweep.co.nz") || url.startsWith("https://images.unsplash.com"),
    { message: "Image must be from an approved domain (puresweep.co.nz or images.unsplash.com)." }
  ).optional().nullable().or(z.literal("")),
  isPublished: z.boolean().default(false),
});
