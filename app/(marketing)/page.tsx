import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Timer,
  Zap,
  Mail,
  Code,
  BarChart3,
  Shield,
  ArrowRight,
  Check,
} from "lucide-react";
import { PLAN_LIMITS, PLAN_LIMITS as PL } from "@/lib/plan-limits";

const GIF_BASE_URL = process.env.NEXT_PUBLIC_GIF_BASE_URL ?? "";

const STEPS = [
  {
    step: "1",
    title: "Design your timer",
    desc: "Pick colors, size, and style. Set your end date. Done in seconds.",
    icon: Timer,
  },
  {
    step: "2",
    title: "Copy the HTML snippet",
    desc: "One small <img> tag. Works in every email builder.",
    icon: Code,
  },
  {
    step: "3",
    title: "Paste into your campaign",
    desc: "Compatible with Klaviyo, Mailchimp, HubSpot, and more.",
    icon: Mail,
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Works in every email client",
    desc: "Animated GIFs render in Gmail, Apple Mail, Outlook, Yahoo, and every major client.",
  },
  {
    icon: Timer,
    title: "Always up to date",
    desc: "Each email open fetches a fresh GIF with the current countdown — no caching.",
  },
  {
    icon: BarChart3,
    title: "Real-time view analytics",
    desc: "Track exactly how many times each timer has been viewed.",
  },
  {
    icon: Code,
    title: "One line of HTML",
    desc: "Just a single <img> tag. No scripts, no iframes, no complexity.",
  },
  {
    icon: Shield,
    title: "Reliable infrastructure",
    desc: "Built on Railway with PostgreSQL. 99.9% uptime SLA on paid plans.",
  },
  {
    icon: Mail,
    title: "Apple Mail compatible",
    desc: "Animated GIFs display perfectly in Apple Mail — no special handling required.",
  },
];

const INTEGRATIONS = [
  "Klaviyo",
  "Mailchimp",
  "HubSpot",
  "ActiveCampaign",
  "Brevo",
  "ConvertKit",
];

const FAQ = [
  {
    q: "How does the countdown work in email?",
    a: "The timer is served as an animated GIF via a simple <img> tag. Every time a recipient opens the email, their client fetches the latest GIF showing the current remaining time.",
  },
  {
    q: "Will it work in Outlook?",
    a: "Outlook 2007–2019 only displays the first frame of animated GIFs. We design the first frame to show meaningful time information so it still looks good. All other email clients display the full animation.",
  },
  {
    q: "What happens when the timer expires?",
    a: "Expired timers display all zeros (00:00:00). On STANDARD+ plans, you can set a custom expiration image to show instead.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative border-b bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-24 text-center">
          <Badge variant="secondary" className="mb-4">
            Works with every email client
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
            Animated Countdown Timers for Email.{" "}
            <span className="text-primary">That Actually Work.</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            Add urgency to any email campaign in minutes. Works with Klaviyo,
            Mailchimp, and every major ESP — no code required.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <ButtonLink href="/register" size="lg" className="gap-2">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/pricing" size="lg" variant="outline">See pricing</ButtonLink>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free forever. No credit card required.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Up and running in 3 steps</h2>
            <p className="text-muted-foreground mt-2">
              No developer needed. Just design, copy, and paste.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {STEPS.map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="text-center">
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  Step {step}
                </div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-b bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Everything you need</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow"
              >
                <Icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-20 border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Simple, honest pricing</h2>
            <p className="text-muted-foreground mt-2">
              Start free. Upgrade when you grow.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {(["FREE", "STARTER", "STANDARD", "POWER"] as const).map(
              (plan) => {
                const limits = PLAN_LIMITS[plan];
                const isPopular = plan === "STANDARD";
                return (
                  <div
                    key={plan}
                    className={`rounded-xl border p-5 relative ${isPopular ? "ring-2 ring-primary" : ""}`}
                  >
                    {isPopular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs">
                        Most Popular
                      </Badge>
                    )}
                    <p className="font-bold text-lg">{limits.label}</p>
                    <p className="text-2xl font-bold mt-1">
                      {limits.monthlyPriceCents === 0
                        ? "Free"
                        : `$${limits.monthlyPriceCents / 100}/mo`}
                    </p>
                    <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                      <li className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 text-green-500 shrink-0" />
                        {limits.maxTimers === -1
                          ? "Unlimited timers"
                          : `${limits.maxTimers} timer${limits.maxTimers > 1 ? "s" : ""}`}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 text-green-500 shrink-0" />
                        {(limits.monthlyViews / 1000).toFixed(0)}K views/mo
                      </li>
                      {!limits.watermark && (
                        <li className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-green-500 shrink-0" />
                          No watermark
                        </li>
                      )}
                    </ul>
                  </div>
                );
              }
            )}
          </div>
          <div className="text-center mt-6">
            <ButtonLink href="/pricing" variant="link">See full pricing →</ButtonLink>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 border-b bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Works with your ESP</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Paste the <code className="bg-muted px-1.5 py-0.5 rounded text-xs">&lt;img&gt;</code> tag into any email builder.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {INTEGRATIONS.map((name) => (
              <span
                key={name}
                className="px-4 py-2 rounded-full border bg-background text-sm font-medium"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-b">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-10">
            Common questions
          </h2>
          <div className="space-y-6">
            {FAQ.map(({ q, a }) => (
              <div key={q}>
                <h3 className="font-semibold">{q}</h3>
                <p className="text-muted-foreground text-sm mt-1">{a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <ButtonLink href="/faq" variant="outline">Read all FAQs →</ButtonLink>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Start for free. Upgrade when you grow.</h2>
          <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">
            No credit card required. One timer, 10,000 views/month, forever free.
          </p>
          <ButtonLink
            href="/register"
            size="lg"
            variant="secondary"
            className="mt-8"
          >
            Create your first timer →
          </ButtonLink>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "EmailCountdown.net",
            url: "https://emailcountdown.net",
            description:
              "Create animated GIF countdown timers for HTML email campaigns.",
          }),
        }}
      />
    </>
  );
}
