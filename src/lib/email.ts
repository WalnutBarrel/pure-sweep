import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Email not sent:", { to, subject });
    return { success: true, mock: true };
  }

  // Generate plain text fallback if not provided
  const plainText =
    text ||
    html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  try {
    const data = await resend.emails.send({
      from: "PureSweep Cleaning <inquiries@puresweep.co.nz>",
      to,
      replyTo: replyTo || "contact.puresweep@gmail.com",
      subject,
      html,
      text: plainText,
      headers: {
        "X-Entity-Ref-ID": `${Date.now()}`,
      },
    });

    if (data.error) {
      console.error("Resend API error:", data.error);
      return { success: false, error: data.error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
