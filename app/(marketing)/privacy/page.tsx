import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "EmailCountdown.net Privacy Policy.",
};

export default function PrivacyPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-3xl prose prose-slate dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: April 2026</p>

        <h2>1. Who we are</h2>
        <p>
          EmailCountdown.net (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
          operates the EmailCountdown.net service. We are committed to
          protecting your personal data in accordance with the General Data
          Protection Regulation (GDPR) and applicable data protection laws.
        </p>

        <h2>2. Data we collect</h2>
        <ul>
          <li>
            <strong>Account data:</strong> Name, email address, hashed password
            (for email/password accounts).
          </li>
          <li>
            <strong>OAuth data:</strong> Name, email, and profile picture from
            Google (for Google-linked accounts).
          </li>
          <li>
            <strong>Timer data:</strong> Timer names, end dates, configuration
            settings you create.
          </li>
          <li>
            <strong>Usage data:</strong> View counts for your timers (anonymous
            aggregate counts only — we do not track individual recipients).
          </li>
          <li>
            <strong>Payment data:</strong> Billing information is collected and
            stored by Paddle (our payment processor). We only receive
            subscription status and plan information.
          </li>
        </ul>

        <h2>3. How we use your data</h2>
        <ul>
          <li>To provide and operate the EmailCountdown.net service</li>
          <li>To send transactional emails (verification, password reset, usage alerts)</li>
          <li>To process payments via Paddle</li>
          <li>To improve our service</li>
        </ul>

        <h2>4. Third-party processors</h2>
        <ul>
          <li>
            <strong>Paddle</strong> — payment processing and subscription
            management. Paddle acts as Merchant of Record.
          </li>
          <li>
            <strong>Google OAuth</strong> — optional sign-in via your Google
            account.
          </li>
          <li>
            <strong>Resend</strong> — transactional email delivery.
          </li>
          <li>
            <strong>Railway</strong> — cloud infrastructure and database hosting.
          </li>
        </ul>

        <h2>5. Cookies</h2>
        <p>
          We use only essential cookies for authentication (session management).
          We do not use advertising or analytics cookies. No cookie consent
          banner is required for essential-only cookies.
        </p>

        <h2>6. Data retention</h2>
        <p>
          We retain your account data for as long as your account is active.
          You can delete your account at any time from Settings, which
          permanently removes all your data including timers.
        </p>

        <h2>7. Your rights (GDPR)</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data (right to be forgotten)</li>
          <li>Export your data in a portable format</li>
          <li>Object to processing</li>
        </ul>
        <p>
          To exercise these rights, email us at{" "}
          <a href="mailto:privacy@emailcountdown.net">
            privacy@emailcountdown.net
          </a>
          .
        </p>

        <h2>8. Contact</h2>
        <p>
          Questions about this policy? Contact:{" "}
          <a href="mailto:hello@emailcountdown.net">hello@emailcountdown.net</a>
        </p>
      </div>
    </div>
  );
}
