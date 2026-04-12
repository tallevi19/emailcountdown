import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const timer = await prisma.timer.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!timer) {
    return NextResponse.json({ error: "Timer not found" }, { status: 404 });
  }

  return NextResponse.json(timer);
}

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  endDate: z.string().datetime().nullable().optional(),
  timezone: z.string().optional(),
  timerType: z
    .enum(["STANDARD", "RECURRING", "PERPETUAL", "DYNAMIC"])
    .optional(),
  config: z.record(z.string(), z.unknown()).optional(),
  isArchived: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Ensure timer belongs to user
    const existing = await prisma.timer.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Timer not found" }, { status: 404 });
    }

    const { name, endDate, timezone, timerType, config, isArchived } =
      parsed.data;

    const updated = await prisma.timer.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(timezone !== undefined && { timezone }),
        ...(timerType !== undefined && { timerType }),
        ...(isArchived !== undefined && { isArchived }),
        ...(config !== undefined && {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          config: { ...(existing.config as Record<string, unknown>), ...config } as any,
        }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update timer error:", error);
    return NextResponse.json(
      { error: "Failed to update timer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const existing = await prisma.timer.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Timer not found" }, { status: 404 });
  }

  await prisma.timer.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
