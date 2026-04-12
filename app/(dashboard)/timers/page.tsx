import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimerTable } from "@/components/timer-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getPlanLimits, canCreateTimer, PlanName } from "@/lib/plan-limits";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const metadata = { title: "Timers" };

export default async function TimersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      timers: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) redirect("/login");

  const active = user.timers.filter((t) => !t.isArchived);
  const archived = user.timers.filter((t) => t.isArchived);
  const plan = user.plan as PlanName;
  const limits = getPlanLimits(plan);
  const canCreate = canCreateTimer(plan, active.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Timers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {active.length} of{" "}
            {limits.maxTimers === -1 ? "unlimited" : limits.maxTimers} timers
            used
          </p>
        </div>
        {canCreate ? (
          <ButtonLink href="/timers/new">
            <Plus className="h-4 w-4 mr-2" />
            New Timer
          </ButtonLink>
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <span>
                <Button disabled>
                  <Plus className="h-4 w-4 mr-2" />
                  New Timer
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                You&apos;ve reached your {limits.label} plan timer limit.{" "}
                <Link href="/billing" className="underline">
                  Upgrade
                </Link>{" "}
                to create more.
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">
            Active ({active.length})
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archived ({archived.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <TimerTable timers={active} />
        </TabsContent>
        <TabsContent value="archived" className="mt-4">
          <TimerTable timers={archived} archived />
        </TabsContent>
      </Tabs>
    </div>
  );
}
