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

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const members = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(members);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = teamMemberSchema.parse(body);

    const member = await prisma.teamMember.create({
      data: { ...data, order: data.order ?? 0 },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
