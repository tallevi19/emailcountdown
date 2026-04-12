import { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about EmailCountdown.net countdown timers.",
};

const FAQ_ITEMS = [
  {
    q: "What is EmailCountdown.net?",
    a: "EmailCountdown.net is a service that lets you create animated GIF countdown timers to embed inside HTML emails. Instead of static text, your subscribers see a live timer counting down to your sale, event, or deadline.",
  },
  {
    q: "How do I embed the timer in my email?",
    a: "After creating your timer, copy the HTML snippet from your dashboard. It's a single <img> tag. Paste it wherever you want the timer to appear in your email HTML or builder.",
  },
  {
    q: "Which email clients are supported?",
    a: "The timer works as an animated GIF in Gmail, Apple Mail, Yahoo Mail, Outlook.com, Thunderbird, iOS Mail, Android Mail, and most other clients. Outlook 2007–2019 (desktop) only shows the first frame, but this frame is designed to display meaningful time information.",
  },
  {
    q: "Does it work with Klaviyo / Mailchimp / HubSpot?",
    a: "Yes! EmailCountdown.net works with any email platform that allows custom HTML. This includes Klaviyo, Mailchimp, HubSpot, ActiveCampaign, Brevo, ConvertKit, and most others. Just paste the <img> tag into your HTML block.",
  },
  {
    q: "What happens when the timer expires?",
    a: "After the end date, the timer displays all zeros (00:00:00). On STANDARD+ plans, you can upload a custom expiration image (e.g. 'Sale ended' graphic) to display instead.",
  },
  {
    q: "What is the watermark on the free plan?",
    a: "Free plan timers show a subtle 'emailcountdown.net' watermark at the bottom of the GIF. Upgrading to any paid plan removes the watermark entirely.",
  },
  {
    q: "How are views counted?",
    a: "Each time the timer GIF is fetched (i.e., each email open), it counts as one view. Views reset at the start of each billing cycle.",
  },
  {
    q: "What happens if I exceed my monthly view limit?",
    a: "If you exceed your limit, the GIF shows all zeros (timer stopped) instead of the live countdown. Your timer embed won't break — it just stops updating. You can upgrade at any time to restore full functionality.",
  },
  {
    q: "Can I change the timer after embedding it in an email?",
    a: "Yes! Since the timer is served dynamically, any changes you make in the dashboard (colors, end date, style) take effect immediately — even in emails that have already been sent.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. The free plan is free forever with no credit card required. You only need payment details when upgrading to a paid plan.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Go to Billing in your dashboard and click 'Manage subscription'. This opens the Paddle customer portal where you can cancel anytime. Your plan remains active until the end of the current billing period.",
  },
  {
    q: "What payment methods are accepted?",
    a: "Payments are processed by Paddle (our Merchant of Record), which accepts all major credit and debit cards, PayPal, and many local payment methods depending on your country.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. We use PostgreSQL on Railway with encrypted connections. Passwords are hashed with bcrypt. We never store payment card details — Paddle handles all payment data. See our Privacy Policy for full details.",
  },
];

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mt-3">
            Everything you need to know about EmailCountdown.net.
          </p>
        </div>

        <Accordion className="space-y-2">
          {FAQ_ITEMS.map(({ q, a }) => (
            <AccordionItem
              key={q}
              value={q}
              className="border rounded-xl px-4"
            >
              <AccordionTrigger className="text-left font-medium py-4">
                {q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
