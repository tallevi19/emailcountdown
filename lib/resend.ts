import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "hello@emailcountdown.net";
const BASE_URL = process.env.NEXTAUTH_URL ?? "https://emailcountdown.net";

function baseHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="font-family:sans-serif;background:#f5f5f5;padding:40px 0;">
<div style="max-width:520px;margin:0 auto;background:#fff;border-radius:8px;padding:40px;">
<h1 style="color:#1a1a1a;font-size:24px;margin-bottom:16px;">${title}</h1>
${body}
<hr style="margin:32px 0;border:none;border-top:1px solid #eee;">
<p style="color:#999;font-size:12px;">EmailCountdown.net — Animated countdown timers for email.</p>
</div>
</body>
</html>`;
}

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to EmailCountdown.net!",
    html: baseHtml(
      `Welcome, ${name || "there"}!`,
      `<p style="color:#555;">Your account is ready. Start creating animated countdown timers that work in every email client.</p>
<a href="${BASE_URL}/dashboard" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:16px;">Go to Dashboard</a>`
    ),
  });
}

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${BASE_URL}/verify-email?token=${token}`;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Verify your email — EmailCountdown.net",
    html: baseHtml(
      "Verify your email address",
      `<p style="color:#555;">Click the button below to verify your email and activate your account. This link expires in 24 hours.</p>
<a href="${url}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:16px;">Verify Email</a>
<p style="color:#999;font-size:12px;margin-top:16px;">Or copy this URL: ${url}</p>`
    ),
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const url = `${BASE_URL}/reset-password?token=${token}`;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your password — EmailCountdown.net",
    html: baseHtml(
      "Reset your password",
      `<p style="color:#555;">Click the button below to reset your password. This link expires in 1 hour.</p>
<a href="${url}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:16px;">Reset Password</a>
<p style="color:#999;font-size:12px;margin-top:16px;">If you did not request a password reset, please ignore this email.</p>`
    ),
  });
}

export async function sendViewLimitWarning(
  to: string,
  name: string,
  percentage: number,
  plan: string
) {
  const atLimit = percentage >= 100;
  await resend.emails.send({
    from: FROM,
    to,
    subject: atLimit
      ? "You've reached your monthly view limit — EmailCountdown.net"
      : `You've used ${percentage}% of your monthly views — EmailCountdown.net`,
    html: baseHtml(
      atLimit ? "Monthly view limit reached" : `${percentage}% of views used`,
      `<p style="color:#555;">Hi ${name || "there"}, your <strong>${plan}</strong> plan has ${atLimit ? "reached" : `used ${percentage}% of`} its monthly view limit.</p>
${atLimit ? '<p style="color:#e63946;">Your timers are currently showing a static fallback. Upgrade to restore full functionality.</p>' : ""}
<a href="${BASE_URL}/billing" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:16px;">Upgrade Plan</a>`
    ),
  });
}
