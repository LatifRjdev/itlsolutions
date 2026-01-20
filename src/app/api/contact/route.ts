import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendContactNotification, sendContactConfirmation } from "@/lib/email";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = contactSchema.parse(body);

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: validatedData,
    });

    console.log("Contact form submission saved:", submission.id);

    // Send email notifications (non-blocking)
    Promise.all([
      sendContactNotification(validatedData),
      sendContactConfirmation(validatedData),
    ]).catch(console.error);

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}
