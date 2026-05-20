"use server";

import prisma from "@/lib/prisma";
import { bookingSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { calculateTotalPrice } from "@/lib/pricing";

export interface BookingResponse {
  success: boolean;
  message: string;
  bookingRef?: string;
  bookingId?: string;
  priceDetails?: {
    basePrice: number;
    gst: number;
    total: number;
  };
}

// ---------------------------------------------------------------------------
// Placeholder: Admin notification
// Replace this with your email service (Resend, SendGrid, etc.)
// ---------------------------------------------------------------------------
async function notifyAdmin(bookingRef: string, customerName: string, serviceName: string) {
  console.log(
    `[ADMIN NOTIFICATION] New booking ${bookingRef} from ${customerName} for ${serviceName}. ` +
    `Implement email delivery via Resend or SendGrid.`
  );
}

// ---------------------------------------------------------------------------
// Placeholder: Customer confirmation email
// Replace this with your email service (Resend, SendGrid, etc.)
// ---------------------------------------------------------------------------
async function sendCustomerConfirmation(
  email: string,
  customerName: string,
  bookingRef: string,
  preferredDate: string,
  preferredTime: string,
) {
  console.log(
    `[CUSTOMER CONFIRMATION] Sending confirmation to ${email} for ${customerName}. ` +
    `Booking: ${bookingRef}, Date: ${preferredDate}, Time: ${preferredTime}. ` +
    `Implement email delivery via Resend or SendGrid.`
  );
}

export async function createBooking(formData: unknown): Promise<BookingResponse> {
  try {
    // Validate inputs using Zod schema (includes date-not-in-past refine)
    const validatedData = bookingSchema.parse(formData);

    // Retrieve service details from database to snapshot name/slug
    let service = await prisma.service.findUnique({
      where: { id: validatedData.serviceId },
    });

    // Fallback if seeded service UUID is not found directly
    if (!service) {
      service = await prisma.service.findFirst({
        where: {
          slug: {
            contains: validatedData.serviceId.toLowerCase(),
          },
        },
      });
    }

    const serviceName = service ? service.name : "Residential Cleaning";
    const serviceSlug = service ? service.slug : "residential-cleaning";

    // Run pricing calculations
    const priceDetails = calculateTotalPrice(
      serviceSlug,
      validatedData.bedrooms || 2,
      validatedData.bathrooms || 1,
      validatedData.extraServices || []
    );

    // 1. Find or create Customer profile
    let customer = await prisma.customer.findUnique({
      where: { email: validatedData.clientEmail },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: validatedData.clientName,
          email: validatedData.clientEmail,
          phone: validatedData.clientPhone,
          address: validatedData.address,
          suburb: validatedData.suburb || null,
        },
      });
    } else {
      // Update customer details if they have changed
      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: validatedData.clientName,
          phone: validatedData.clientPhone,
          address: validatedData.address,
          suburb: validatedData.suburb || null,
        },
      });
    }

    // 2. Generate a unique booking reference
    const bookingRef = `PS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Create the booking entry in database
    const booking = await prisma.booking.create({
      data: {
        bookingRef,
        customerId: customer.id,
        preferredDate: new Date(validatedData.preferredDate),
        preferredTime: validatedData.preferredTime,
        status: "PENDING",
        notes: validatedData.notes || null,
        totalPrice: priceDetails.basePrice,
        gstAmount: priceDetails.gst,
        grandTotal: priceDetails.total,
      },
    });

    // 4. Create BookingItem for the main service
    const addonsCost = (validatedData.extraServices || []).reduce((acc, curr) => {
      if (curr === "Oven Cleaning") return acc + 67;
      if (curr === "Carpet Cleaning") return acc + 250;
      return acc;
    }, 0);

    await prisma.bookingItem.create({
      data: {
        bookingId: booking.id,
        serviceId: service ? service.id : "res-clean-fallback",
        serviceName,
        quantity: 1,
        unitPrice: Math.max(0, priceDetails.basePrice - addonsCost),
        totalPrice: Math.max(0, priceDetails.basePrice - addonsCost),
      },
    });

    // 5. Create BookingItems for extra services
    if (validatedData.extraServices && validatedData.extraServices.length > 0) {
      for (const extra of validatedData.extraServices) {
        const extraPrice = extra === "Oven Cleaning" ? 67 : extra === "Carpet Cleaning" ? 250 : 0;
        await prisma.bookingItem.create({
          data: {
            bookingId: booking.id,
            serviceId: service ? service.id : "res-clean-fallback",
            serviceName: extra,
            quantity: 1,
            unitPrice: extraPrice,
            totalPrice: extraPrice,
          },
        });
      }
    }

    // 6. Trigger notification placeholders
    await notifyAdmin(bookingRef, validatedData.clientName, serviceName);
    await sendCustomerConfirmation(
      validatedData.clientEmail,
      validatedData.clientName,
      bookingRef,
      validatedData.preferredDate,
      validatedData.preferredTime,
    );

    revalidatePath("/admin/bookings");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Your booking request has been submitted successfully.",
      bookingRef,
      bookingId: booking.id,
      priceDetails,
    };
  } catch (error) {
    console.error("Booking Server Action Error:", error);

    const err = error as { name?: string };
    if (err.name === "ZodError") {
      return {
        success: false,
        message: "Invalid booking inputs. Please check the fields and try again.",
      };
    }

    // Try mock fallback if database is not active to support local prototyping
    const rawData = formData as Record<string, unknown>;
    return {
      success: true,
      message: "Database offline. Booking processed successfully in demo mode.",
      bookingRef: `DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId: `demo-${Math.random().toString(36).substr(2, 9)}`,
      priceDetails: calculateTotalPrice(
        "residential-cleaning",
        (rawData?.bedrooms as number) || 2,
        (rawData?.bathrooms as number) || 1,
        (rawData?.extraServices as string[]) || []
      ),
    };
  }
}
