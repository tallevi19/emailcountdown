import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Timer, Eye, Activity, Plus, AlertTriangle } from "lucide-react";
import Link from "next/link";
import {
  getPlanLimits,
  getViewLimitPercentage,
  PlanName,
} from "@/lib/plan-limits";
import { formatDistanceToNow } from "date-fns";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      timers: {
        where: { isArchived: false },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      _count: { select: { timers: { where: { isArchived: false } } } },
    },
  });

  if (!user) redirect("/login");

  const plan = user.plan as PlanName;
  const limits = getPlanLimits(plan);

  const billingCycleViews = user.timers.reduce(
    (s, t) => s + t.billingCycleViews,
    0
  );
  const totalViewsAllTime = user.timers.reduce(
    (s, t) => s + t.totalViews,
    0
  );
  const viewPct = getViewLimitPercentage(plan, billingCycleViews);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back, {user.name ?? user.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="capitalize">
            {limits.label} Plan
          </Badge>
          <ButtonLink href="/timers/new">
            <Plus className="h-4 w-4 mr-2" />
            New Timer
          </ButtonLink>
        </div>
      </div>

      {/* Limit warning */}
      {viewPct >= 80 && (
        <Alert variant={viewPct >= 100 ? "destructive" : "default"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {viewPct >= 100 ? (
              <>
                You&apos;ve reached your monthly view limit. Your timers are
                showing a static fallback.{" "}
                <Link href="/billing" className="underline font-medium">
                  Upgrade now
                </Link>
              </>
            ) : (
              <>
                You&apos;re at {viewPct}% of your monthly view limit.{" "}
                <Link href="/billing" className="underline font-medium">
                  Consider upgrading
                </Link>
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Timers</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user._count.timers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              of{" "}
              {limits.maxTimers === -1 ? "unlimited" : limits.maxTimers} allowed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalViewsAllTime.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              all time across all timers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              This Billing Cycle
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {billingCycleViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {limits.monthlyViews.toLocaleString()} views
            </p>
            <Progress value={viewPct} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
      </div>

      {/* Recent timers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Recent Timers
          </CardTitle>
          <ButtonLink href="/timers" variant="ghost" size="sm">View all</ButtonLink>
        </CardHeader>
        <CardContent>
          {user.timers.length === 0 ? (
            <div className="text-center py-10">
              <Timer className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No timers yet.{" "}
                <Link href="/timers/new" className="text-primary underline">
                  Create your first timer
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {user.timers.map((timer) => (
                <div
                  key={timer.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{timer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {timer.endDate
                        ? timer.endDate > new Date()
                          ? `Ends ${formatDistanceToNow(timer.endDate, { addSuffix: true })}`
                          : "Expired"
                        : timer.timerType === "PERPETUAL"
                          ? "Perpetual timer"
                          : "No end date"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {timer.totalViews.toLocaleString()} views
                    </span>
                    <ButtonLink href={`/timers/${timer.id}`} variant="ghost" size="sm">Edit</ButtonLink>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
