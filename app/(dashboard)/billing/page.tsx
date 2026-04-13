import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  PLAN_LIMITS,
  getPlanLimits,
  getViewLimitPercentage,
  PlanName,
} from "@/lib/plan-limits";
import { PaddleCheckoutButton } from "@/components/paddle-checkout-button";

export const metadata = { title: "Billing" };

const PLANS: PlanName[] = ["FREE", "STARTER", "STANDARD", "POWER"];

function formatPrice(cents: number): string {
  if (cents === 0) return "Free";
  return `$${(cents / 100).toFixed(0)}/mo`;
}

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      timers: {
        where: { isArchived: false },
        select: { billingCycleViews: true },
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
  const viewPct = getViewLimitPercentage(plan, billingCycleViews);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your subscription and usage.
        </p>
      </div>

      {/* Current plan summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Current Plan
            <Badge>{limits.label}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Timers</p>
              <p className="font-semibold">
                {user._count.timers} /{" "}
                {limits.maxTimers === -1 ? "∞" : limits.maxTimers}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Views this cycle</p>
              <p className="font-semibold">
                {billingCycleViews.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Monthly limit</p>
              <p className="font-semibold">
                {limits.monthlyViews.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Usage</p>
              <p className="font-semibold">{viewPct}%</p>
            </div>
          </div>
          <Progress value={viewPct} className="h-2" />

          {user.paddleSubscriptionId && (
            <div className="pt-2">
              <ButtonLink href="/api/billing/portal" variant="outline" size="sm">
                <ExternalLink className="h-3.5 w-3.5 mr-2" />
                Manage subscription
              </ButtonLink>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
          {PLANS.map((planName) => {
            const planLimits = PLAN_LIMITS[planName];
            const isCurrent = planName === plan;
            const isPopular = planName === "STANDARD";

            return (
              <Card
                key={planName}
                className={`relative flex flex-col overflow-visible ${isCurrent ? "border-primary" : ""} ${isPopular ? "ring-2 ring-primary" : ""}`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
                    <Badge className="text-xs px-3">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    {planLimits.label}
                    {isCurrent && (
                      <Badge variant="secondary" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-2xl font-bold">
                    {formatPrice(planLimits.monthlyPriceCents)}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 space-y-3">
                  <ul className="flex-1 space-y-1.5 text-xs text-muted-foreground">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-green-500 shrink-0" />
                      {planLimits.maxTimers === -1
                        ? "Unlimited timers"
                        : `${planLimits.maxTimers} timers`}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-green-500 shrink-0" />
                      {planLimits.monthlyViews.toLocaleString()} views/mo
                    </li>
                    {!planLimits.watermark && (
                      <li className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 text-green-500 shrink-0" />
                        No watermark
                      </li>
                    )}
                    {planLimits.customColors && (
                      <li className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 text-green-500 shrink-0" />
                        Custom colors
                      </li>
                    )}
                    {planLimits.transparentBg && (
                      <li className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 text-green-500 shrink-0" />
                        Transparent bg
                      </li>
                    )}
                    {planLimits.expirationImage && (
                      <li className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 text-green-500 shrink-0" />
                        Expiration image
                      </li>
                    )}
                    {planLimits.allowDynamic && (
                      <li className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 text-green-500 shrink-0" />
                        Dynamic timers
                      </li>
                    )}
                  </ul>

                  <div>
                    {!isCurrent && planName !== "FREE" && (
                      <PaddleCheckoutButton
                        planName={planName}
                        customerEmail={session.user.email ?? ""}
                      />
                    )}
                    {isCurrent && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled
                      >
                        Current plan
                      </Button>
                    )}
                    {planName === "FREE" && !isCurrent && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled
                      >
                        Downgrade
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Payments processed by{" "}
          <a
            href="https://paddle.com"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Paddle
          </a>{" "}
          (Merchant of Record). Cancel anytime.
        </p>
      </div>
    </div>
  );
}
