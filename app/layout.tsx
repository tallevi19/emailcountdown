import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "EmailCountdown.net — Animated Countdown Timers for Email",
    template: "%s | EmailCountdown.net",
  },
  description:
    "Create animated GIF countdown timers that embed perfectly in any HTML email. Works with Klaviyo, Mailchimp, HubSpot, and every major ESP.",
  openGraph: {
    title: "EmailCountdown.net — Animated Countdown Timers for Email",
    description:
      "Add urgency to any email campaign in minutes. Animated GIF timers that work in every email client.",
    type: "website",
    url: "https://emailcountdown.net",
    siteName: "EmailCountdown.net",
  },
  twitter: {
    card: "summary_large_image",
    title: "EmailCountdown.net",
    description: "Animated countdown timers for HTML email campaigns.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider>
          {children}
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
