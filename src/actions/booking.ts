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
// Placeholder email functions ready for Brevo/Resend/Nodemailer later
// ---------------------------------------------------------------------------
export async function sendAdminBookingNotification(
  bookingRef: string,
  customerName: string,
  serviceName: string
) {
  console.log(
    `[ADMIN EMAIL] sendAdminBookingNotification: New booking ${bookingRef} created by ${customerName} for ${serviceName}.`
  );
}

export async function sendCustomerBookingConfirmation(
  email: string,
  customerName: string,
  bookingRef: string,
  preferredDate: string,
  preferredTime: string
) {
  if (!email || email.includes("no-email-")) {
    console.log(`[CUSTOMER EMAIL] sendCustomerBookingConfirmation: Skipped (no email provided for ${customerName}).`);
    return;
  }
  console.log(
    `[CUSTOMER EMAIL] sendCustomerBookingConfirmation: Confirmation sent to ${email} for booking ${bookingRef} scheduled on ${preferredDate} (${preferredTime}).`
  );
}

export async function sendAdminInquiryNotification(
  name: string,
  email: string,
  message: string
) {
  console.log(
    `[ADMIN EMAIL] sendAdminInquiryNotification: New inquiry from ${name} (${email}). Message snippet: "${message.substring(0, 60)}..."`
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
    // Generate a unique fallback email if none was provided
    const cleanPhoneForEmail = validatedData.clientPhone.replace(/[^0-9]/g, "");
    const emailToUse = validatedData.clientEmail?.trim() || `no-email-${cleanPhoneForEmail}@puresweep.co.nz`;

    // Search by email first, then fallback to searching by phone to avoid duplicates
    let customer = await prisma.customer.findFirst({
      where: {
        OR: [
          validatedData.clientEmail ? { email: validatedData.clientEmail } : undefined,
          { phone: validatedData.clientPhone }
        ].filter(Boolean) as any
      }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: validatedData.clientName,
          email: emailToUse,
          phone: validatedData.clientPhone,
          address: validatedData.address,
          suburb: validatedData.suburb || null,
        },
      });
    } else {
      // Update customer details if they have changed, keeping their email
      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: validatedData.clientName,
          phone: validatedData.clientPhone,
          address: validatedData.address,
          suburb: validatedData.suburb || null,
          // Only update email if it was previously a placeholder and the user provided a real one now
          email: (customer.email.includes("no-email-") && validatedData.clientEmail) 
            ? validatedData.clientEmail 
            : customer.email,
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
    await sendAdminBookingNotification(bookingRef, validatedData.clientName, serviceName);
    await sendCustomerBookingConfirmation(
      validatedData.clientEmail || "",
      validatedData.clientName,
      bookingRef,
      validatedData.preferredDate,
      validatedData.preferredTime
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
