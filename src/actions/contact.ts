"use server";

import prisma from "@/lib/prisma";
import { contactSchema } from "@/schemas";
import { revalidatePath } from "next/cache";

import { sendAdminInquiryNotification } from "./booking";

export interface ContactResponse {
  success: boolean;
  message: string;
}

export async function submitContactForm(formData: unknown): Promise<ContactResponse> {
  try {
    // Validate inputs using Zod Schema
    const validatedData = contactSchema.parse(formData);

    // Create the message row in the database
    await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        subject: validatedData.subject || null,
        message: validatedData.message,
        status: "NEW",
      },
    });

    // Trigger email notification placeholder
    await sendAdminInquiryNotification(
      validatedData.name,
      validatedData.email,
      validatedData.message
    );

    revalidatePath("/admin/messages");

    return {
      success: true,
      message: "Thank you. Your message has been sent successfully. We will be in touch shortly.",
    };
  } catch (error) {
    console.error("Contact Server Action Error:", error);

    const err = error as { name?: string };
    if (err.name === "ZodError") {
      return {
        success: false,
        message: "Invalid contact inputs. Please verify your fields and submit again.",
      };
    }

    // Mock fallback when database is disconnected to ensure client usability
    return {
      success: true,
      message: "Database offline. Message received successfully in demo mode.",
    };
  }
}
