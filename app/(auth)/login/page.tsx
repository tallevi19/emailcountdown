"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { toast } from "sonner";
import { Globe } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const error = searchParams.get("error");

  async function handleCredentialsLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      toast.error(
        result.error === "CredentialsSignin"
          ? "Invalid email or password, or email not verified."
          : "Sign in failed. Please try again."
      );
    } else {
      router.push("/dashboard");
    }
  }

  async function handleGoogleLogin() {
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-center">Sign in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <p className="text-sm text-destructive text-center bg-destructive/10 px-3 py-2 rounded-md">
            {error === "OAuthAccountNotLinked"
              ? "This email is already registered. Please sign in with email/password."
              : "An error occurred. Please try again."}
          </p>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
        >
          <Globe className="h-4 w-4 mr-2" />
          Continue with Google
        </Button>

        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Sign up free
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
