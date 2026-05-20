"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  adminServiceSchema,
  adminPricingPlanSchema,
  adminBookingSchema,
  adminCustomerSchema,
  adminInvoiceSchema,
  adminPaymentSchema,
  adminExpenseSchema,
  adminStaffSchema,
  adminTestimonialSchema,
  adminSettingSchema,
} from "@/schemas";
import { ExpenseCategory, BookingStatus, PaymentStatus } from "@prisma/client";

// HELPER: Log administrative activity
async function logActivity(action: string, details: string) {
  try {
    await prisma.activityLog.create({
      data: {
        action,
        details,
      },
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

// ============================================================================
// 1. SERVICES CRUD
// ============================================================================
export async function createService(data: unknown) {
  const result = adminServiceSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const service = await prisma.service.create({
      data: {
        name: result.data.name,
        slug: result.data.slug,
        description: result.data.description,
        basePrice: result.data.basePrice,
        priceType: result.data.priceType,
        priceDescription: result.data.priceDescription,
        category: result.data.category,
        features: result.data.features,
        isActive: result.data.isActive,
      },
    });

    await logActivity("CREATE_SERVICE", `Created service "${service.name}"`);
    revalidatePath("/admin/services");
    revalidatePath("/admin/pricing");
    return { success: true, service };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to create service." };
  }
}

export async function updateService(id: string, data: unknown) {
  const result = adminServiceSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const service = await prisma.service.update({
      where: { id },
      data: {
        name: result.data.name,
        slug: result.data.slug,
        description: result.data.description,
        basePrice: result.data.basePrice,
        priceType: result.data.priceType,
        priceDescription: result.data.priceDescription,
        category: result.data.category,
        features: result.data.features,
        isActive: result.data.isActive,
      },
    });

    await logActivity("UPDATE_SERVICE", `Updated service "${service.name}"`);
    revalidatePath("/admin/services");
    revalidatePath("/admin/pricing");
    return { success: true, service };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update service." };
  }
}

export async function deleteService(id: string) {
  try {
    const service = await prisma.service.delete({
      where: { id },
    });

    await logActivity("DELETE_SERVICE", `Deleted service "${service.name}"`);
    revalidatePath("/admin/services");
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete service." };
  }
}

// ============================================================================
// 2. PRICING PLANS CRUD
// ============================================================================
export async function createPricingPlan(data: unknown) {
  const result = adminPricingPlanSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const plan = await prisma.pricingPlan.create({
      data: {
        serviceId: result.data.serviceId,
        name: result.data.name,
        price: result.data.price,
        description: result.data.description,
        features: result.data.features,
        isActive: result.data.isActive,
      },
    });

    await logActivity("CREATE_PRICING_PLAN", `Created pricing plan "${plan.name}"`);
    revalidatePath("/admin/pricing");
    return { success: true, plan };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to create pricing plan." };
  }
}

export async function updatePricingPlan(id: string, data: unknown) {
  const result = adminPricingPlanSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const plan = await prisma.pricingPlan.update({
      where: { id },
      data: {
        serviceId: result.data.serviceId,
        name: result.data.name,
        price: result.data.price,
        description: result.data.description,
        features: result.data.features,
        isActive: result.data.isActive,
      },
    });

    await logActivity("UPDATE_PRICING_PLAN", `Updated pricing plan "${plan.name}"`);
    revalidatePath("/admin/pricing");
    return { success: true, plan };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update pricing plan." };
  }
}

export async function deletePricingPlan(id: string) {
  try {
    const plan = await prisma.pricingPlan.delete({
      where: { id },
    });

    await logActivity("DELETE_PRICING_PLAN", `Deleted pricing plan "${plan.name}"`);
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete pricing plan." };
  }
}

// ============================================================================
// 3. BOOKINGS CRUD
// ============================================================================
export async function createBookingAdmin(data: unknown) {
  const result = adminBookingSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const bookingRef = `PS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const booking = await prisma.booking.create({
      data: {
        bookingRef,
        customerId: result.data.customerId,
        preferredDate: new Date(result.data.preferredDate),
        preferredTime: result.data.preferredTime,
        status: result.data.status as BookingStatus,
        notes: result.data.notes,
        totalPrice: result.data.totalPrice,
        gstAmount: result.data.gstAmount,
        grandTotal: result.data.grandTotal,
      },
    });

    if (result.data.assignedStaffId) {
      await prisma.staffBookings.create({
        data: {
          staffId: result.data.assignedStaffId,
          bookingId: booking.id,
        },
      });
    }

    await logActivity("CREATE_BOOKING", `Created booking "${bookingRef}"`);
    revalidatePath("/admin/bookings");
    revalidatePath("/admin/dashboard");
    return { success: true, booking };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to create booking." };
  }
}

export async function updateBookingAdmin(id: string, data: unknown) {
  const result = adminBookingSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        customerId: result.data.customerId,
        preferredDate: new Date(result.data.preferredDate),
        preferredTime: result.data.preferredTime,
        status: result.data.status as BookingStatus,
        notes: result.data.notes,
        totalPrice: result.data.totalPrice,
        gstAmount: result.data.gstAmount,
        grandTotal: result.data.grandTotal,
      },
    });

    // Handle staff assignments
    await prisma.staffBookings.deleteMany({
      where: { bookingId: id },
    });

    if (result.data.assignedStaffId) {
      await prisma.staffBookings.create({
        data: {
          staffId: result.data.assignedStaffId,
          bookingId: id,
        },
      });
    }

    await logActivity("UPDATE_BOOKING", `Updated booking "${booking.bookingRef}"`);
    revalidatePath("/admin/bookings");
    revalidatePath("/admin/dashboard");
    return { success: true, booking };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update booking." };
  }
}

export async function deleteBookingAdmin(id: string) {
  try {
    const booking = await prisma.booking.delete({
      where: { id },
    });

    await logActivity("DELETE_BOOKING", `Deleted booking "${booking.bookingRef}"`);
    revalidatePath("/admin/bookings");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete booking." };
  }
}

// ============================================================================
// 4. CUSTOMERS CRUD
// ============================================================================
export async function createCustomer(data: unknown) {
  const result = adminCustomerSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const customer = await prisma.customer.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        address: result.data.address,
        suburb: result.data.suburb,
        notes: result.data.notes,
      },
    });

    await logActivity("CREATE_CUSTOMER", `Registered customer "${customer.name}"`);
    revalidatePath("/admin/customers");
    revalidatePath("/admin/dashboard");
    return { success: true, customer };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to create customer." };
  }
}

export async function updateCustomer(id: string, data: unknown) {
  const result = adminCustomerSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        address: result.data.address,
        suburb: result.data.suburb,
        notes: result.data.notes,
      },
    });

    await logActivity("UPDATE_CUSTOMER", `Updated customer "${customer.name}"`);
    revalidatePath("/admin/customers");
    revalidatePath("/admin/dashboard");
    return { success: true, customer };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update customer." };
  }
}

export async function deleteCustomer(id: string) {
  try {
    const customer = await prisma.customer.delete({
      where: { id },
    });

    await logActivity("DELETE_CUSTOMER", `Deleted customer "${customer.name}"`);
    revalidatePath("/admin/customers");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete customer." };
  }
}

// ============================================================================
// 5. INVOICES CRUD
// ============================================================================
export async function createInvoice(data: unknown) {
  const result = adminInvoiceSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId: result.data.customerId,
        bookingId: result.data.bookingId,
        issueDate: new Date(result.data.issueDate),
        dueDate: new Date(result.data.dueDate),
        subtotal: result.data.subtotal,
        gstAmount: result.data.gstAmount,
        totalAmount: result.data.totalAmount,
        status: result.data.status as PaymentStatus,
      },
    });

    await logActivity("CREATE_INVOICE", `Generated invoice "${invoiceNumber}"`);
    revalidatePath("/admin/invoices");
    revalidatePath("/admin/dashboard");
    return { success: true, invoice };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to generate invoice." };
  }
}

export async function updateInvoice(id: string, data: unknown) {
  const result = adminInvoiceSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        customerId: result.data.customerId,
        bookingId: result.data.bookingId,
        issueDate: new Date(result.data.issueDate),
        dueDate: new Date(result.data.dueDate),
        subtotal: result.data.subtotal,
        gstAmount: result.data.gstAmount,
        totalAmount: result.data.totalAmount,
        status: result.data.status as PaymentStatus,
      },
    });

    await logActivity("UPDATE_INVOICE", `Updated invoice "${invoice.invoiceNumber}"`);
    revalidatePath("/admin/invoices");
    revalidatePath("/admin/dashboard");
    return { success: true, invoice };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update invoice." };
  }
}

export async function deleteInvoice(id: string) {
  try {
    const invoice = await prisma.invoice.delete({
      where: { id },
    });

    await logActivity("DELETE_INVOICE", `Deleted invoice "${invoice.invoiceNumber}"`);
    revalidatePath("/admin/invoices");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete invoice." };
  }
}

// ============================================================================
// 6. PAYMENTS CRUD
// ============================================================================
export async function createPayment(data: unknown) {
  const result = adminPaymentSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const payment = await prisma.payment.create({
      data: {
        invoiceId: result.data.invoiceId,
        amount: result.data.amount,
        paymentDate: new Date(result.data.paymentDate),
        paymentMethod: result.data.paymentMethod,
        transactionRef: result.data.transactionRef,
        status: result.data.status as PaymentStatus,
      },
    });

    // Update corresponding invoice status based on payment details
    const invoice = await prisma.invoice.findUnique({
      where: { id: result.data.invoiceId },
    });

    if (invoice) {
      const newStatus = result.data.status;
      await prisma.invoice.update({
        where: { id: result.data.invoiceId },
        data: { status: newStatus as PaymentStatus },
      });
    }

    await logActivity("PAYMENT_RECORDED", `Recorded payment of $${Number(payment.amount).toFixed(2)}`);
    revalidatePath("/admin/invoices");
    revalidatePath("/admin/dashboard");
    return { success: true, payment };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to record payment." };
  }
}

// ============================================================================
// 7. EXPENSES CRUD
// ============================================================================
export async function createExpense(data: unknown) {
  const result = adminExpenseSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const expense = await prisma.expense.create({
      data: {
        description: result.data.description,
        category: result.data.category as ExpenseCategory,
        amount: result.data.amount,
        gstAmount: result.data.gstAmount,
        date: new Date(result.data.date),
        recipient: result.data.recipient,
        notes: result.data.notes,
      },
    });

    await logActivity("CREATE_EXPENSE", `Recorded expense: "${expense.description}"`);
    revalidatePath("/admin/expenses");
    revalidatePath("/admin/dashboard");
    return { success: true, expense };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to log expense." };
  }
}

export async function updateExpense(id: string, data: unknown) {
  const result = adminExpenseSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const expense = await prisma.expense.update({
      where: { id },
      data: {
        description: result.data.description,
        category: result.data.category as ExpenseCategory,
        amount: result.data.amount,
        gstAmount: result.data.gstAmount,
        date: new Date(result.data.date),
        recipient: result.data.recipient,
        notes: result.data.notes,
      },
    });

    await logActivity("UPDATE_EXPENSE", `Updated expense: "${expense.description}"`);
    revalidatePath("/admin/expenses");
    revalidatePath("/admin/dashboard");
    return { success: true, expense };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update expense." };
  }
}

export async function deleteExpense(id: string) {
  try {
    const expense = await prisma.expense.delete({
      where: { id },
    });

    await logActivity("DELETE_EXPENSE", `Deleted expense: "${expense.description}"`);
    revalidatePath("/admin/expenses");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete expense." };
  }
}

// ============================================================================
// 8. STAFF CRUD
// ============================================================================
export async function createStaff(data: unknown) {
  const result = adminStaffSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    // Generate a temporary User account for the staff if email is provided
    let userId = "";
    if (result.data.email) {
      const user = await prisma.user.create({
        data: {
          email: result.data.email,
          name: `${result.data.firstName} ${result.data.lastName}`,
          role: "STAFF",
        },
      });
      userId = user.id;
    } else {
      // Create user without email if missing
      const user = await prisma.user.create({
        data: {
          email: `staff-${Math.floor(1000 + Math.random() * 9000)}@puresweep.co.nz`,
          name: `${result.data.firstName} ${result.data.lastName}`,
          role: "STAFF",
        },
      });
      userId = user.id;
    }

    const staff = await prisma.staff.create({
      data: {
        userId,
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        phone: result.data.phone,
        hourlyRate: result.data.hourlyRate,
        isActive: result.data.isActive,
      },
    });

    await logActivity("CREATE_STAFF", `Hired staff "${staff.firstName} ${staff.lastName}"`);
    revalidatePath("/admin/dashboard");
    return { success: true, staff };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to hire staff." };
  }
}

export async function updateStaff(id: string, data: unknown) {
  const result = adminStaffSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const staff = await prisma.staff.update({
      where: { id },
      data: {
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        phone: result.data.phone,
        hourlyRate: result.data.hourlyRate,
        isActive: result.data.isActive,
      },
    });

    await logActivity("UPDATE_STAFF", `Updated staff coordinates for "${staff.firstName}"`);
    revalidatePath("/admin/dashboard");
    return { success: true, staff };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update staff." };
  }
}

export async function deleteStaff(id: string) {
  try {
    const staff = await prisma.staff.delete({
      where: { id },
    });

    await logActivity("DELETE_STAFF", `Terminated staff listing "${staff.firstName} ${staff.lastName}"`);
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete staff." };
  }
}

// ============================================================================
// 9. TESTIMONIALS CRUD
// ============================================================================
export async function createTestimonial(data: unknown) {
  const result = adminTestimonialSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        quote: result.data.quote,
        author: result.data.author,
        role: result.data.role,
        location: result.data.location,
        rating: result.data.rating,
        isApproved: result.data.isApproved,
      },
    });

    await logActivity("CREATE_TESTIMONIAL", `Added testimonial from "${testimonial.author}"`);
    revalidatePath("/");
    return { success: true, testimonial };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to add testimonial." };
  }
}

export async function updateTestimonial(id: string, data: unknown) {
  const result = adminTestimonialSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        quote: result.data.quote,
        author: result.data.author,
        role: result.data.role,
        location: result.data.location,
        rating: result.data.rating,
        isApproved: result.data.isApproved,
      },
    });

    await logActivity("UPDATE_TESTIMONIAL", `Updated testimonial approval for "${testimonial.author}"`);
    revalidatePath("/");
    return { success: true, testimonial };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update testimonial." };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({
      where: { id },
    });

    await logActivity("DELETE_TESTIMONIAL", `Deleted testimonial id: ${id}`);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete testimonial." };
  }
}

// ============================================================================
// 10. SETTINGS CRUD
// ============================================================================
export async function updateSetting(key: string, value: string, description?: string) {
  try {
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });

    await logActivity("UPDATE_SETTING", `Configured setting "${key}" to "${value}"`);
    revalidatePath("/admin/settings");
    return { success: true, setting };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update system settings." };
  }
}

// ============================================================================
// 11. INQUIRIES / CONTACT MESSAGES
// ============================================================================
export async function updateContactMessageStatus(id: string, read: boolean) {
  try {
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read },
    });

    await logActivity("UPDATE_INQUIRY", `Marked contact message from "${message.name}" as ${read ? "read" : "unread"}`);
    revalidatePath("/admin/messages");
    return { success: true, message };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update inquiry status." };
  }
}

export async function deleteContactMessage(id: string) {
  try {
    await prisma.contactMessage.delete({
      where: { id },
    });

    await logActivity("DELETE_INQUIRY", `Deleted contact message id: ${id}`);
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete inquiry." };
  }
}
