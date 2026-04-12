import { Paddle, Environment } from "@paddle/paddle-node-sdk";

export const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment:
    process.env.PADDLE_ENVIRONMENT === "production"
      ? Environment.production
      : Environment.sandbox,
});

export const PADDLE_PRICE_IDS = {
  STARTER_MONTHLY: process.env.PADDLE_STARTER_MONTHLY_PRICE_ID!,
  STARTER_ANNUAL: process.env.PADDLE_STARTER_ANNUAL_PRICE_ID!,
  STANDARD_MONTHLY: process.env.PADDLE_STANDARD_MONTHLY_PRICE_ID!,
  STANDARD_ANNUAL: process.env.PADDLE_STANDARD_ANNUAL_PRICE_ID!,
  POWER_MONTHLY: process.env.PADDLE_POWER_MONTHLY_PRICE_ID!,
  POWER_ANNUAL: process.env.PADDLE_POWER_ANNUAL_PRICE_ID!,
} as const;

export function getPlanFromPriceId(
  priceId: string
): "STARTER" | "STANDARD" | "POWER" | null {
  const map: Record<string, "STARTER" | "STANDARD" | "POWER"> = {
    [PADDLE_PRICE_IDS.STARTER_MONTHLY]: "STARTER",
    [PADDLE_PRICE_IDS.STARTER_ANNUAL]: "STARTER",
    [PADDLE_PRICE_IDS.STANDARD_MONTHLY]: "STANDARD",
    [PADDLE_PRICE_IDS.STANDARD_ANNUAL]: "STANDARD",
    [PADDLE_PRICE_IDS.POWER_MONTHLY]: "POWER",
    [PADDLE_PRICE_IDS.POWER_ANNUAL]: "POWER",
  };
  return map[priceId] ?? null;
}
