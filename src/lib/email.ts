import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Email not sent:", { to, subject });
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from: "PureSweep Notifications <inquiries@puresweep.co.nz>",
      to,
      subject,
      html,
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
