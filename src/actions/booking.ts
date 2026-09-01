import { headers } from "next/headers";
import { formRateLimiter } from "@/lib/rate-limit";
"use server";

import prisma from "@/lib/prisma";
import { bookingSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { calculateTotalPrice } from "@/lib/pricing";
import { sendEmail } from "@/lib/email";

export interface BookingResponse {
  success: boolean;
  message: string;
  bookingRef?: string;
  bookingId?: string;
  contactPhone?: string;
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
  // Fetch admin email from settings
  const emailSetting = await prisma.setting.findUnique({ where: { key: "contact_email" } });
  const adminEmail = emailSetting?.value || "contact.puresweep@gmail.com";

  await sendEmail({
    to: adminEmail,
    subject: `[BOOKING] New Request: ${bookingRef} - ${serviceName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafaf9; padding: 40px 20px; color: #1c1917;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="background-color: #1c1917; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase;">PureSweep</h1>
          </div>
          <div style="padding: 40px 30px;">
            <div style="margin-bottom: 20px;">
              <span style="background-color: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">NEW BOOKING</span>
            </div>
            <h2 style="margin-top: 0; color: #1c1917; font-size: 20px; font-weight: 500;">New Booking Received</h2>
            <p style="color: #57534e; font-size: 15px; line-height: 1.6;">A new booking request has been submitted through the website.</p>
            
            <table style="width: 100%; margin: 30px 0; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f5f5f4; color: #78716c; font-size: 14px; width: 30%;">Reference</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f5f5f4; color: #1c1917; font-size: 15px; font-weight: 500;">${bookingRef}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f5f5f4; color: #78716c; font-size: 14px;">Customer</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f5f5f4; color: #1c1917; font-size: 15px; font-weight: 500;">${customerName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f5f5f4; color: #78716c; font-size: 14px;">Service</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f5f5f4; color: #1c1917; font-size: 15px; font-weight: 500;">${serviceName}</td>
              </tr>
            </table>

            <div style="text-align: center; margin-top: 40px;">
              <a href="https://puresweep.co.nz/admin/bookings" style="background-color: #1c1917; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 4px; font-size: 14px; font-weight: 500; letter-spacing: 1px; display: inline-block;">VIEW IN DASHBOARD</a>
            </div>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendCustomerBookingConfirmation(
  email: string,
  customerName: string,
  bookingRef: string,
  preferredDate: string,
  preferredTime: string
) {
  if (!email || email.includes("no-email-")) {
    return;
  }

  await sendEmail({
    to: email,
    subject: `[PureSweep] Booking Request Received - ${bookingRef}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafaf9; padding: 40px 20px; color: #1c1917;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="background-color: #1c1917; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase;">PureSweep</h1>
          </div>
          <div style="padding: 40px 30px;">
            <div style="margin-bottom: 20px;">
              <span style="background-color: #f3f4f6; color: #4b5563; padding: 6px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">BOOKING CONFIRMATION</span>
            </div>
            <h2 style="margin-top: 0; color: #1c1917; font-size: 20px; font-weight: 500;">Thank you for choosing PureSweep!</h2>
            <p style="color: #57534e; font-size: 15px; line-height: 1.6;">Hi ${customerName},</p>
            <p style="color: #57534e; font-size: 15px; line-height: 1.6;">We've successfully received your booking request. Our team is currently reviewing your details and will be in touch shortly to confirm your booking and arrange access.</p>
            
            <div style="background-color: #f5f5f4; padding: 20px; border-radius: 6px; margin: 30px 0;">
              <p style="margin: 0 0 10px 0; color: #78716c; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Request Details</p>
              <p style="margin: 0 0 5px 0; font-size: 15px;"><strong>Reference:</strong> ${bookingRef}</p>
              <p style="margin: 0 0 5px 0; font-size: 15px;"><strong>Date:</strong> ${preferredDate}</p>
              <p style="margin: 0; font-size: 15px;"><strong>Time:</strong> ${preferredTime}</p>
            </div>

            <p style="color: #57534e; font-size: 15px; line-height: 1.6; margin-top: 30px;">Best regards,<br/><strong>The PureSweep Team</strong></p>
            <p style="margin-top: 40px; text-align: center; font-size: 13px; color: #a8a29e;">
              <a href="https://puresweep.co.nz" style="color: #78716c; text-decoration: none;">puresweep.co.nz</a>
            </p>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendAdminInquiryNotification(
  name: string,
  email: string,
  message: string
) {
  const emailSetting = await prisma.setting.findUnique({ where: { key: "contact_email" } });
  const adminEmail = emailSetting?.value || "contact.puresweep@gmail.com";

  await sendEmail({
    to: adminEmail,
    replyTo: email,
    subject: `[INQUIRY] New Contact Message from ${name}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafaf9; padding: 40px 20px; color: #1c1917;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="background-color: #1c1917; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase;">PureSweep</h1>
          </div>
          <div style="padding: 40px 30px;">
            <div style="margin-bottom: 20px;">
              <span style="background-color: #e0e7ff; color: #3730a3; padding: 6px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">NEW INQUIRY</span>
            </div>
            <h2 style="margin-top: 0; color: #1c1917; font-size: 20px; font-weight: 500;">New Contact Inquiry</h2>
            
            <table style="width: 100%; margin: 30px 0; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f5f5f4; color: #78716c; font-size: 14px; width: 20%;">Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f5f5f4; color: #1c1917; font-size: 15px; font-weight: 500;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f5f5f4; color: #78716c; font-size: 14px;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f5f5f4; color: #1c1917; font-size: 15px; font-weight: 500;">${email}</td>
              </tr>
            </table>

            <div style="background-color: #f5f5f4; padding: 24px; border-radius: 6px; margin: 30px 0;">
              <p style="margin: 0; color: #57534e; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>

            <div style="text-align: center; margin-top: 40px;">
              <a href="https://puresweep.co.nz/admin/messages" style="background-color: #1c1917; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 4px; font-size: 14px; font-weight: 500; letter-spacing: 1px; display: inline-block;">VIEW INBOX</a>
            </div>
          </div>
        </div>
      </div>
    `,
  });
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
    let bookingRef: string;
    let isUnique = false;
    while (!isUnique) {
      bookingRef = `PS-${randomBytes(6).toString("hex").toUpperCase()}`;
      const existing = await prisma.booking.findFirst({ where: { bookingRef } });
      if (!existing) isUnique = true;
    }
    // Type assertion to quiet TS if it complains before assignment (it won't since while runs at least once)
    const finalBookingRef = bookingRef!;

    // 3. Create the booking entry in database
    const booking = await prisma.booking.create({
      data: {
        bookingRef: finalBookingRef,
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
    await sendAdminBookingNotification(finalBookingRef, validatedData.clientName, serviceName);
    await sendCustomerBookingConfirmation(
      validatedData.clientEmail || "",
      validatedData.clientName,
      finalBookingRef,
      validatedData.preferredDate,
      validatedData.preferredTime
    );

    revalidatePath("/admin/bookings");
    revalidatePath("/admin/dashboard");

    // Fetch contact phone from settings
    const phoneSetting = await prisma.setting.findUnique({ where: { key: "contact_phone" } });
    const contactPhone = phoneSetting?.value || "642102699956";

    return {
      success: true,
      message: "Your booking request has been submitted successfully.",
      bookingRef: finalBookingRef,
      bookingId: booking.id,
      priceDetails,
      contactPhone,
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

    return {
      success: false,
      message: "We couldn't process your booking. Please try again or call us directly.",
    };
  }
}

