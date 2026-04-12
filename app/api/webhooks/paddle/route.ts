import { NextRequest, NextResponse } from "next/server";
import { paddle, getPlanFromPriceId } from "@/lib/paddle";
import { prisma } from "@/lib/db";
import { EventName } from "@paddle/paddle-node-sdk";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("paddle-signature") ?? "";

  let event;
  try {
    event = await paddle.webhooks.unmarshal(
      rawBody,
      process.env.PADDLE_WEBHOOK_SECRET!,
      signature
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.eventType) {
      case EventName.SubscriptionActivated:
      case EventName.SubscriptionUpdated: {
        const sub = event.data as {
          id: string;
          customerId: string;
          items: Array<{ price?: { id: string } }>;
        };
        const priceId = sub.items[0]?.price?.id ?? "";
        const plan = getPlanFromPriceId(priceId) ?? "FREE";

        await prisma.user.updateMany({
          where: { paddleCustomerId: sub.customerId },
          data: {
            plan,
            paddleSubscriptionId: sub.id,
            billingCycleStart: new Date(),
          },
        });

        // Reset all timer billing cycle views
        await prisma.$executeRaw`
          UPDATE "Timer" SET "billingCycleViews" = 0
          WHERE "userId" IN (
            SELECT id FROM "User" WHERE "paddleCustomerId" = ${sub.customerId}
          )
        `;
        break;
      }

      case EventName.SubscriptionCanceled: {
        const sub = event.data as { id: string };
        await prisma.user.updateMany({
          where: { paddleSubscriptionId: sub.id },
          data: { plan: "FREE", paddleSubscriptionId: null },
        });
        break;
      }

      case EventName.CustomerCreated: {
        // Save paddleCustomerId when customer is first created via checkout
        const customer = event.data as {
          id: string;
          email: string;
        };
        await prisma.user.updateMany({
          where: { email: customer.email, paddleCustomerId: null },
          data: { paddleCustomerId: customer.id },
        });
        break;
      }

      case EventName.TransactionCompleted: {
        const txn = event.data as { customerId?: string };
        if (txn.customerId) {
          await prisma.user.updateMany({
            where: { paddleCustomerId: txn.customerId },
            data: { billingCycleStart: new Date() },
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error("Paddle webhook processing error:", error);
    // Still return 200 to prevent Paddle retrying a permanently failing event
  }

  return NextResponse.json({ received: true });
}
