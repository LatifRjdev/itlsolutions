import nodemailer from "nodemailer";
import { prisma } from "./prisma";

interface ContactEmailParams {
  firstName: string;
  lastName: string;
  email: string;
  subject?: string;
  message: string;
}

interface SendEmailParams {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
  text?: string;
  inReplyTo?: string;
  references?: string[];
}

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: process.env.SMTP_SECURE !== "false", // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendContactNotification(params: ContactEmailParams) {
  const { firstName, lastName, email, subject, message } = params;

  const transporter = getTransporter();
  if (!transporter) {
    console.log("SMTP not configured, skipping email notification");
    return null;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
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

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    return null;
  }
}

export async function sendContactConfirmation(params: ContactEmailParams) {
  const { firstName, email } = params;

  const transporter = getTransporter();
  if (!transporter) {
    return null;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
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

    console.log("Confirmation sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send confirmation:", error);
    return null;
  }
}

interface ChatInquiryEmailParams {
  name: string;
  email: string;
  message: string;
  locale: string;
}

export async function sendChatInquiryNotification(params: ChatInquiryEmailParams) {
  const { name, email, message, locale } = params;

  const transporter = getTransporter();
  if (!transporter) {
    console.log("SMTP not configured, skipping chat inquiry notification");
    return null;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.EMAIL_TO || "info@itlsolutions.net",
      subject: `Chat Inquiry: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #137fec;">New Chat Inquiry</h2>

          <div style="background: #f6f7f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Language:</strong> ${locale.toUpperCase()}</p>
          </div>

          <div style="padding: 20px; border-left: 4px solid #137fec; background: #f9fafb;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>

          <p style="color: #617589; font-size: 14px; margin-top: 30px;">
            This inquiry was sent from the website chatbox.
          </p>
        </div>
      `,
    });

    console.log("Chat inquiry notification sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send chat inquiry notification:", error);
    return null;
  }
}

export async function sendEmail(params: SendEmailParams) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error("SMTP not configured");
  }

  const { to, cc, bcc, subject, html, text, inReplyTo, references } = params;

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: to.join(", "),
    cc: cc?.join(", "),
    bcc: bcc?.join(", "),
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ""),
    inReplyTo,
    references: references?.join(" "),
  });

  // Store in database as sent email
  await prisma.email.create({
    data: {
      messageId: info.messageId || `sent-${Date.now()}`,
      uid: 0,
      folder: "Sent",
      from: process.env.SMTP_USER || "",
      fromName: "ITL Solutions",
      to,
      cc: cc || [],
      subject,
      htmlBody: html,
      textBody: text || html.replace(/<[^>]*>/g, ""),
      snippet: (text || html.replace(/<[^>]*>/g, "")).substring(0, 200),
      isRead: true,
      inReplyTo: inReplyTo || null,
      references: references || [],
      date: new Date(),
    },
  });

  return info;
}
