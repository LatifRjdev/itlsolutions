import { Resend } from "resend";

interface ContactEmailParams {
  firstName: string;
  lastName: string;
  email: string;
  subject?: string;
  message: string;
}

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendContactNotification(params: ContactEmailParams) {
  const { firstName, lastName, email, subject, message } = params;

  const resend = getResendClient();
  if (!resend) {
    console.log("RESEND_API_KEY not configured, skipping email notification");
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "ITL Solutions <onboarding@resend.dev>",
      to: process.env.EMAIL_TO || "info@itlsolutions.net",
      subject: `New Contact: ${subject || "Contact Form Submission"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #137fec;">New Contact Form Submission</h2>

          <div style="background: #f6f7f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
          </div>

          <div style="padding: 20px; border-left: 4px solid #137fec; background: #f9fafb;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>

          <p style="color: #617589; font-size: 14px; margin-top: 30px;">
            This email was sent from your website contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Email error:", error);
    return null;
  }
}

export async function sendContactConfirmation(params: ContactEmailParams) {
  const { firstName, email } = params;

  const resend = getResendClient();
  if (!resend) {
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "ITL Solutions <onboarding@resend.dev>",
      to: email,
      subject: "Thank you for contacting ITL Solutions",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #137fec;">Thank You for Reaching Out!</h2>

          <p>Dear ${firstName},</p>

          <p>Thank you for contacting ITL Solutions. We have received your message and will get back to you within 24-48 business hours.</p>

          <p>In the meantime, feel free to explore our services and recent projects on our website.</p>

          <p>Best regards,<br/>The ITL Solutions Team</p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

          <p style="color: #617589; font-size: 12px;">
            This is an automated confirmation email. Please do not reply to this message.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Failed to send confirmation:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Email error:", error);
    return null;
  }
}
