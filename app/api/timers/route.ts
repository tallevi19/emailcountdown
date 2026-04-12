import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { canCreateTimer } from "@/lib/plan-limits";
import { z } from "zod";
import { DEFAULT_TIMER_CONFIG } from "@/lib/timer-config";

const createTimerSchema = z.object({
  name: z.string().min(1).max(100),
  timerType: z.enum(["STANDARD", "RECURRING", "PERPETUAL", "DYNAMIC"] as const).default("STANDARD"),
  endDate: z.string().datetime().optional(),
  timezone: z.string().default("UTC"),
  config: z.record(z.string(), z.unknown()).optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timers = await prisma.timer.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(timers);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createTimerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        _count: { select: { timers: { where: { isArchived: false } } } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!canCreateTimer(user.plan, user._count.timers)) {
      return NextResponse.json(
        { error: "Timer limit reached for your plan. Please upgrade to create more timers." },
        { status: 403 }
      );
    }

    const { name, timerType, endDate, timezone, config } = parsed.data;

    const timer = await prisma.timer.create({
      data: {
        userId: session.user.id,
        name,
        timerType,
        endDate: endDate ? new Date(endDate) : null,
        timezone,
        config: { ...DEFAULT_TIMER_CONFIG, ...(config ?? {}), watermark: user.plan === "FREE" },
      },
    });

    return NextResponse.json(timer, { status: 201 });
  } catch (error) {
    console.error("Create timer error:", error);
    return NextResponse.json(
      { error: "Failed to create timer" },
      { status: 500 }
    );
  }
}
