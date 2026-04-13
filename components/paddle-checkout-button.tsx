"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Paddle } from "@paddle/paddle-js";
import { PlanName } from "@/lib/plan-limits";
import { toast } from "sonner";

const PRICE_IDS: Record<PlanName, string | undefined> = {
  FREE: undefined,
  STARTER: process.env.NEXT_PUBLIC_PADDLE_STARTER_MONTHLY_PRICE_ID,
  STANDARD: process.env.NEXT_PUBLIC_PADDLE_STANDARD_MONTHLY_PRICE_ID,
  POWER: process.env.NEXT_PUBLIC_PADDLE_POWER_MONTHLY_PRICE_ID,
};

interface PaddleCheckoutButtonProps {
  planName: PlanName;
  customerEmail?: string;
}

export function PaddleCheckoutButton({
  planName,
  customerEmail,
}: PaddleCheckoutButtonProps) {
  const [paddle, setPaddle] = useState<Paddle | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) return;
    import("@paddle/paddle-js").then(({ initializePaddle }) => {
      initializePaddle({
        environment:
          (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as
            | "sandbox"
            | "production") ?? "sandbox",
        token,
      }).then(setPaddle);
    });
  }, []);

  const priceId = PRICE_IDS[planName];
  const label = `Upgrade to ${planName.charAt(0) + planName.slice(1).toLowerCase()}`;

  async function handleCheckout() {
    if (!priceId) {
      toast.error("Price not configured — add the Paddle price ID to Railway env vars.");
      return;
    }
    if (!paddle) {
      toast.error("Paddle is still loading, please try again.");
      return;
    }
    setLoading(true);
    try {
      await paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: customerEmail ? { email: customerEmail } : undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="sm"
      className="w-full"
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? "Loading..." : label}
    </Button>
  );
}
