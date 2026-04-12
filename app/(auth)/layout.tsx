import Link from "next/link";
import { Timer } from "lucide-react";
import { SessionProvider } from "@/components/session-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-8">
          <Timer className="h-7 w-7 text-primary" />
          <span>EmailCountdown.net</span>
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </SessionProvider>
  );
}
