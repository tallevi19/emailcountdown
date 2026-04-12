import Link from "next/link";
import { Timer } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <Timer className="h-5 w-5 text-primary" />
              <span>EmailCountdown.net</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Animated countdown timers for HTML email campaigns. Works with every major
              email service provider.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Payments processed by{" "}
              <a
                href="https://paddle.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Paddle
              </a>{" "}
              (Merchant of Record)
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
              <li><Link href="/login" className="hover:text-foreground">Login</Link></li>
              <li><Link href="/register" className="hover:text-foreground">Sign up free</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} EmailCountdown.net. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
