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
import { PLAN_LIMITS } from "@/lib/plan-limits";

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
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Timer,
    title: "Always up to date",
    desc: "Each email open fetches a fresh GIF with the current countdown — no caching.",
    gradient: "from-indigo-500 to-violet-600",
  },
  {
    icon: BarChart3,
    title: "Real-time view analytics",
    desc: "Track exactly how many times each timer has been viewed.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Code,
    title: "One line of HTML",
    desc: "Just a single <img> tag. No scripts, no iframes, no complexity.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Shield,
    title: "Reliable infrastructure",
    desc: "Built on Railway with PostgreSQL. 99.9% uptime SLA on paid plans.",
    gradient: "from-violet-600 to-indigo-600",
  },
  {
    icon: Mail,
    title: "Apple Mail compatible",
    desc: "Animated GIFs display perfectly in Apple Mail — no special handling required.",
    gradient: "from-pink-500 to-violet-500",
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
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-indigo-50 border-b">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-violet-400/20 to-indigo-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-purple-400/15 to-violet-300/15 blur-3xl" />

        <div className="relative container mx-auto px-4 py-28 text-center">
          <Badge variant="secondary" className="mb-5 border border-violet-200 bg-violet-50 text-violet-700">
            Works with every email client
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
            Animated Countdown Timers for Email.{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
              That Actually Work.
            </span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            Add urgency to any email campaign in minutes. Works with Klaviyo,
            Mailchimp, and every major ESP — no code required.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <ButtonLink
              href="/register"
              size="lg"
              className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 border-0 shadow-lg shadow-violet-200"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/pricing" size="lg" variant="outline" className="border-violet-200 hover:bg-violet-50">
              See pricing
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free forever. No credit card required.
          </p>
        </div>
      </section>

      {/* ESP dark band */}
      <section className="bg-slate-900 py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm font-medium mb-6 uppercase tracking-widest">
            Paste one &lt;img&gt; tag into any email builder
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {INTEGRATIONS.map((name) => (
              <span
                key={name}
                className="text-slate-300 font-semibold text-sm tracking-wide"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-3 border border-violet-200 bg-violet-50 text-violet-700">
              How it works
            </Badge>
            <h2 className="text-3xl font-bold">Up and running in 3 steps</h2>
            <p className="text-muted-foreground mt-2">
              No developer needed. Just design, copy, and paste.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {STEPS.map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="text-center">
                <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white mx-auto mb-4 shadow-lg shadow-violet-200">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-xs font-bold text-violet-500 uppercase tracking-widest mb-1">
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
      <section className="py-24 border-b bg-gradient-to-b from-violet-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-3 border border-violet-200 bg-violet-50 text-violet-700">
              Features
            </Badge>
            <h2 className="text-3xl font-bold">Everything you need</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {FEATURES.map(({ icon: Icon, title, desc, gradient }) => (
              <div
                key={title}
                className="rounded-2xl border bg-white p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br ${gradient} text-white mb-4 shadow-md`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-24 border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-3 border border-violet-200 bg-violet-50 text-violet-700">
              Pricing
            </Badge>
            <h2 className="text-3xl font-bold">Simple, honest pricing</h2>
            <p className="text-muted-foreground mt-2">
              Start free. Upgrade when you grow.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {(["FREE", "STARTER", "STANDARD", "POWER"] as const).map((plan) => {
              const limits = PLAN_LIMITS[plan];
              const isPopular = plan === "STANDARD";
              return (
                <div
                  key={plan}
                  className={`rounded-2xl border p-5 relative bg-white transition-shadow hover:shadow-lg ${
                    isPopular
                      ? "ring-2 ring-violet-500 shadow-lg shadow-violet-100"
                      : ""
                  }`}
                >
                  {isPopular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-gradient-to-r from-violet-600 to-indigo-600 border-0">
                      Most Popular
                    </Badge>
                  )}
                  <p className="font-bold text-lg">{limits.label}</p>
                  <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
                    {limits.monthlyPriceCents === 0
                      ? "Free"
                      : `$${limits.monthlyPriceCents / 100}/mo`}
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-violet-500 shrink-0" />
                      {limits.maxTimers === -1
                        ? "Unlimited timers"
                        : `${limits.maxTimers} timer${limits.maxTimers > 1 ? "s" : ""}`}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-violet-500 shrink-0" />
                      {(limits.monthlyViews / 1000).toFixed(0)}K views/mo
                    </li>
                    {!limits.watermark && (
                      <li className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 text-violet-500 shrink-0" />
                        No watermark
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-6">
            <ButtonLink href="/pricing" variant="link" className="text-violet-600 hover:text-violet-700">
              See full pricing →
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-b bg-gradient-to-b from-violet-50/30 to-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3 border border-violet-200 bg-violet-50 text-violet-700">
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold">Common questions</h2>
          </div>
          <div className="space-y-6">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="rounded-2xl border bg-white p-6">
                <h3 className="font-semibold">{q}</h3>
                <p className="text-muted-foreground text-sm mt-2">{a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <ButtonLink href="/faq" variant="outline" className="border-violet-200 hover:bg-violet-50">
              Read all FAQs →
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">
            Start for free. Upgrade when you grow.
          </h2>
          <p className="mt-3 text-white/75 max-w-xl mx-auto">
            No credit card required. One timer, 10,000 views/month, forever free.
          </p>
          <ButtonLink
            href="/register"
            size="lg"
            variant="secondary"
            className="mt-8 bg-white text-violet-700 hover:bg-violet-50 shadow-xl"
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
