import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { CustomizationPanel } from "@/components/customization-panel";
import { TimerPreview } from "@/components/timer-preview";
import { SIZE_PRESETS, TimerConfigType } from "@/lib/timer-config";
import { PlanName } from "@/lib/plan-limits";
import { Badge } from "@/components/ui/badge";
import { TimerType } from "@prisma/client";
import { InlineTimerName } from "./inline-name";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const timer = await prisma.timer.findUnique({
    where: { id },
    select: { name: true },
  });
  return { title: timer?.name ?? "Timer Editor" };
}

export default async function TimerEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const timer = await prisma.timer.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!timer) notFound();

  const config = (timer.config ?? {}) as Partial<TimerConfigType>;
  const sizeKey = (config.size ?? "M") as keyof typeof SIZE_PRESETS;
  const { width, height } = SIZE_PRESETS[sizeKey] ?? SIZE_PRESETS.M;
  const plan = session.user.plan as PlanName;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left: Config panel */}
      <div className="w-full lg:w-72 xl:w-80 shrink-0">
        <div className="sticky top-0 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="capitalize text-xs">
              {timer.timerType.toLowerCase()}
            </Badge>
            {timer.endDate && (
              <span className="text-xs text-muted-foreground">
                Ends {timer.endDate.toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="rounded-xl border bg-card p-1">
            <CustomizationPanel
              timer={timer}
              plan={plan}
              onConfigChange={() => {}}
            />
          </div>
        </div>
      </div>

      {/* Center: Preview + code */}
      <div className="flex-1 min-w-0 space-y-4">
        <InlineTimerName timer={{ id: timer.id, name: timer.name }} />
        <TimerPreview timerId={timer.id} width={width} height={height} />
      </div>
    </div>
  );
}
