import { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { PLAN_LIMITS } from "@/lib/plan-limits";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple pricing for email countdown timers. Start free, upgrade when you grow.",
};

const PLANS = ["FREE", "STARTER", "STANDARD", "POWER"] as const;

const FEATURES: { label: string; key: keyof typeof PLAN_LIMITS.FREE }[] = [
  { label: "Max timers", key: "maxTimers" },
  { label: "Monthly views", key: "monthlyViews" },
  { label: "No watermark", key: "watermark" },
  { label: "Custom colors", key: "customColors" },
  { label: "Transparent background", key: "transparentBg" },
  { label: "Background image", key: "backgroundImage" },
  { label: "Expiration image", key: "expirationImage" },
  { label: "Fallback image (Apple Mail)", key: "fallbackImage" },
  { label: "Recurring timers", key: "allowRecurring" },
  { label: "Dynamic timers (per-recipient)", key: "allowDynamic" },
  { label: "Vertical timer layout", key: "verticalTimer" },
  { label: "Custom padding", key: "padding" },
  { label: "Custom labels", key: "labelCustomization" },
];

function formatFeatureValue(
  key: keyof typeof PLAN_LIMITS.FREE,
  value: unknown
): string | boolean {
  if (key === "maxTimers") {
    return (value as number) === -1 ? "Unlimited" : String(value);
  }
  if (key === "monthlyViews") {
    const n = value as number;
    return n >= 1_000_000 ? `${n / 1_000_000}M` : `${n / 1000}K`;
  }
  if (key === "watermark") return !(value as boolean); // invert: "no watermark" = true when watermark=false
  return value as boolean;
}

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold">Simple, honest pricing</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Start with 1 timer and 10,000 views for free. Pay only when you
            need more.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
          {PLANS.map((plan) => {
            const limits = PLAN_LIMITS[plan];
            const isPopular = plan === "STANDARD";
            return (
              <div
                key={plan}
                className={`rounded-xl border p-6 relative flex flex-col ${isPopular ? "ring-2 ring-primary shadow-lg" : ""}`}
              >
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs">
                    Most Popular
                  </Badge>
                )}
                <div>
                  <p className="font-bold text-lg">{limits.label}</p>
                  <p className="text-3xl font-bold mt-2">
                    {limits.monthlyPriceCents === 0
                      ? "Free"
                      : `$${limits.monthlyPriceCents / 100}`}
                    {limits.monthlyPriceCents > 0 && (
                      <span className="text-sm font-normal text-muted-foreground">
                        /mo
                      </span>
                    )}
                  </p>
                  {limits.annualPriceCents > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      ${limits.annualPriceCents / 100}/mo billed annually
                    </p>
                  )}
                </div>

                <ul className="my-6 space-y-2 text-sm flex-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    {limits.maxTimers === -1
                      ? "Unlimited timers"
                      : `${limits.maxTimers} timer${limits.maxTimers > 1 ? "s" : ""}`}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    {limits.monthlyViews.toLocaleString()} views/mo
                  </li>
                  {!limits.watermark && (
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      No watermark
                    </li>
                  )}
                  {limits.customColors && (
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      Custom colors
                    </li>
                  )}
                  {limits.transparentBg && (
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      Transparent background
                    </li>
                  )}
                  {limits.expirationImage && (
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      Expiration image
                    </li>
                  )}
                  {limits.allowDynamic && (
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      Dynamic & recurring timers
                    </li>
                  )}
                  {limits.fallbackImage && (
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      Apple Mail fallback image
                    </li>
                  )}
                </ul>

                <ButtonLink
                  href="/register"
                  className="w-full"
                  variant={isPopular ? "default" : "outline"}
                >
                  {plan === "FREE" ? "Get started free" : `Get ${limits.label}`}
                </ButtonLink>
              </div>
            );
          })}
        </div>

        {/* Comparison table */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Full comparison</h2>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-left p-4 font-medium">Feature</th>
                  {PLANS.map((p) => (
                    <th key={p} className="text-center p-4 font-medium">
                      {PLAN_LIMITS[p].label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map(({ label, key }) => (
                  <tr key={key} className="border-b last:border-0">
                    <td className="p-4 text-muted-foreground">{label}</td>
                    {PLANS.map((plan) => {
                      const rawValue = PLAN_LIMITS[plan][key];
                      const displayValue = formatFeatureValue(key, rawValue);

                      return (
                        <td key={plan} className="p-4 text-center">
                          {typeof displayValue === "boolean" ? (
                            displayValue ? (
                              <Check className="h-4 w-4 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                            )
                          ) : (
                            <span>{displayValue}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paddle note */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Payments are processed by{" "}
          <a
            href="https://paddle.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Paddle
          </a>{" "}
          (Merchant of Record) — they handle VAT, taxes, and compliance globally.
          Cancel anytime. No hidden fees.
        </p>
      </div>
    </div>
  );
}
