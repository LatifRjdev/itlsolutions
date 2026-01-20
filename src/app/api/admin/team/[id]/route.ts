import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const teamMemberSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  role: z.string().min(1),
  department: z.string().min(1),
  bio: z.string().min(1),
  image: z.string().min(1),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  order: z.number().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const data = teamMemberSchema.parse(body);

    const member = await prisma.teamMember.update({
      where: { id },
      data: { ...data, order: data.order ?? 0 },
    });

    return NextResponse.json(member);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
