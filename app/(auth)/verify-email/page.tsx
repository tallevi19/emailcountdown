"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";

type State = "idle" | "loading" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<State>(token ? "loading" : "idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (res.ok) {
          setState("success");
        } else {
          const data = await res.json();
          setErrorMsg(data.error ?? "Verification failed");
          setState("error");
        }
      })
      .catch(() => {
        setErrorMsg("Network error. Please try again.");
        setState("error");
      });
  }, [token]);

  return (
    <Card>
      <CardContent className="pt-8 pb-6 text-center space-y-4">
        {state === "idle" && (
          <>
            <Mail className="h-12 w-12 text-muted-foreground mx-auto" />
            <h2 className="text-lg font-semibold">Check your email</h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              We sent a verification link to your email address. Click it to
              activate your account.
            </p>
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive it? Check your spam folder.
            </p>
          </>
        )}

        {state === "loading" && (
          <>
            <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
            <p className="text-sm text-muted-foreground">
              Verifying your email…
            </p>
          </>
        )}

        {state === "success" && (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-lg font-semibold">Email verified!</h2>
            <p className="text-sm text-muted-foreground">
              Your account is now active. You can sign in.
            </p>
            <ButtonLink href="/login">Sign in</ButtonLink>
          </>
        )}

        {state === "error" && (
          <>
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-lg font-semibold">Verification failed</h2>
            <p className="text-sm text-muted-foreground">{errorMsg}</p>
            <ButtonLink href="/register" variant="outline">Try registering again</ButtonLink>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
