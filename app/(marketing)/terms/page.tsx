import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "EmailCountdown.net Terms of Service.",
};

export default function TermsPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-3xl prose prose-slate dark:prose-invert">
        <h1>Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: April 2026</p>

        <h2>1. Service description</h2>
        <p>
          EmailCountdown.net provides a web-based service for creating animated
          GIF countdown timers for use in HTML email campaigns. By using this
          service, you agree to these Terms.
        </p>

        <h2>2. User accounts</h2>
        <p>
          You must create an account to use EmailCountdown.net. You are
          responsible for maintaining the confidentiality of your account
          credentials and for all activities under your account. You must
          provide accurate information and notify us immediately of any
          unauthorized access.
        </p>

        <h2>3. Acceptable use</h2>
        <p>You agree not to use EmailCountdown.net to:</p>
        <ul>
          <li>Send spam or unsolicited messages</li>
          <li>Violate any applicable laws or regulations</li>
          <li>Attempt to circumvent service limits or security measures</li>
          <li>Resell or redistribute the service without authorization</li>
          <li>
            Use the service in any way that could harm EmailCountdown.net or
            other users
          </li>
        </ul>

        <h2>4. Payment and refunds</h2>
        <p>
          Payments are processed by Paddle, our Merchant of Record. Paddle
          handles billing, invoicing, and compliance. Subscription fees are
          billed in advance. You may cancel at any time; cancellation takes
          effect at the end of the current billing period. We do not offer
          prorated refunds for unused time, except where required by law.
        </p>

        <h2>5. Service limits</h2>
        <p>
          Each plan has defined limits for timers and monthly views. Exceeding
          view limits results in timers showing a static fallback — we do not
          charge overage fees, but the service will be degraded until the next
          billing cycle.
        </p>

        <h2>6. Intellectual property</h2>
        <p>
          EmailCountdown.net retains ownership of the platform, code, and brand.
          You retain ownership of any content you upload (logos, images). You
          grant us a license to store and serve your content to deliver the
          service.
        </p>

        <h2>7. Limitation of liability</h2>
        <p>
          EmailCountdown.net is provided &quot;as is&quot; without warranty of
          any kind. We are not liable for any indirect, incidental, or
          consequential damages arising from use of the service. Our total
          liability shall not exceed the fees paid in the 3 months preceding the
          claim.
        </p>

        <h2>8. Termination</h2>
        <p>
          We reserve the right to suspend or terminate accounts that violate
          these Terms. You may delete your account at any time from Settings.
          Upon termination, your timers will stop serving and your data will be
          deleted within 30 days.
        </p>

        <h2>9. Governing law</h2>
        <p>
          These Terms are governed by the laws of the jurisdiction where
          EmailCountdown.net operates. Disputes shall be resolved in accordance
          with those laws.
        </p>

        <h2>10. Changes</h2>
        <p>
          We may update these Terms. We&apos;ll notify users by email for
          material changes. Continued use after changes constitutes acceptance.
        </p>

        <h2>Contact</h2>
        <p>
          Questions?{" "}
          <a href="mailto:hello@emailcountdown.net">hello@emailcountdown.net</a>
        </p>
      </div>
    </div>
  );
}
