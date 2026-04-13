import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  generateCountdownGif,
  generateLimitExceededGif,
} from "@/lib/gif-generator";
import { getPlanLimits, isOverViewLimit } from "@/lib/plan-limits";
import { TimerConfigType, DEFAULT_TIMER_CONFIG } from "@/lib/timer-config";
import { Plan } from "@prisma/client";
import { sendViewLimitWarning } from "@/lib/resend";

export const runtime = "nodejs"; // CRITICAL: canvas cannot run in Edge runtime
export const dynamic = "force-dynamic";

const GIF_HEADERS = {
  "Content-Type": "image/gif",
  "Cache-Control":
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ timerId: string }> }
) {
  const { timerId } = await params;

  try {
    const timer = await prisma.timer.findUnique({
      where: { id: timerId, isArchived: false },
      include: {
        user: { select: { plan: true, email: true, name: true } },
      },
    });

    if (!timer) {
      return new NextResponse("Not found", { status: 404 });
    }

    const userPlan = timer.user.plan as Plan;
    const planKey = userPlan as keyof typeof import("@/lib/plan-limits").PLAN_LIMITS;
    const planLimits = getPlanLimits(planKey);

    const rawConfig = (timer.config ?? {}) as Partial<TimerConfigType>;
    // Enforce plan restrictions server-side
    const effectiveConfig: TimerConfigType = {
      ...DEFAULT_TIMER_CONFIG,
      ...rawConfig,
      watermark: planLimits.watermark,
      transparentBackground: planLimits.transparentBg
        ? (rawConfig.transparentBackground ?? false)
        : false,
    };

    const searchParams = request.nextUrl.searchParams;
    // Skip view counting for in-app preview requests (adds ?preview=1)
    const isPreview = searchParams.get("preview") === "1";

    // Non-blocking view count increment (fire-and-forget)
    if (!isPreview) prisma.timer
      .update({
        where: { id: timerId },
        data: {
          totalViews: { increment: 1 },
          billingCycleViews: { increment: 1 },
        },
      })
      .then(async (updated) => {
        const views = updated.billingCycleViews;
        const limit = planLimits.monthlyViews;
        const pct = (views / limit) * 100;

        // Alert at 80% and 100% thresholds
        if (views === Math.floor(limit * 0.8) || views === limit) {
          await sendViewLimitWarning(
            timer.user.email,
            timer.user.name ?? "",
            Math.round(pct),
            planLimits.label
          ).catch(console.error);
        }
      })
      .catch(console.error);

    // Check if over limit
    if (isOverViewLimit(planKey, timer.billingCycleViews)) {
      const gif = await generateLimitExceededGif(effectiveConfig);
      return new NextResponse(new Uint8Array(gif), { headers: GIF_HEADERS });
    }

    // Calculate seconds remaining based on timer type
    let secondsRemaining = 0;

    if (timer.timerType === "PERPETUAL") {
      const duration = searchParams.get("duration");
      secondsRemaining = duration ? Math.max(0, parseInt(duration, 10)) : 0;
    } else if (timer.timerType === "DYNAMIC") {
      const sentAt = searchParams.get("sent");
      if (sentAt && timer.endDate) {
        // endDate stores the countdown duration end relative to creation
        const sendTimeMs = parseInt(sentAt, 10) * 1000;
        const durationMs =
          timer.endDate.getTime() - timer.createdAt.getTime();
        secondsRemaining = Math.max(
          0,
          (sendTimeMs + durationMs - Date.now()) / 1000
        );
      }
    } else {
      // STANDARD or RECURRING
      if (timer.endDate) {
        secondsRemaining = Math.max(
          0,
          (timer.endDate.getTime() - Date.now()) / 1000
        );
      }
    }

    const gif = await generateCountdownGif(secondsRemaining, effectiveConfig);
    return new NextResponse(new Uint8Array(gif), { headers: GIF_HEADERS });
  } catch (error) {
    console.error("GIF generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
