import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendChatInquiryNotification } from "@/lib/email";

const inquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  locale: z.enum(["en", "ru"]).default("en"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = inquirySchema.parse(body);

    const inquiry = await prisma.chatInquiry.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
        locale: data.locale,
      },
    });

    console.log("Chat inquiry saved:", inquiry.id);

    // Send email notification (non-blocking)
    sendChatInquiryNotification(data).catch(console.error);

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Chat inquiry error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}
