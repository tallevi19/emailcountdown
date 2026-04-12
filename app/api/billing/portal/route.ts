import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { paddle } from "@/lib/paddle";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { paddleCustomerId: true },
  });

  if (!user?.paddleCustomerId) {
    return NextResponse.json(
      { error: "No billing account found. Please subscribe to a plan first." },
      { status: 404 }
    );
  }

  try {
    const result = await (paddle.customers as any).createPortalSession(
      user.paddleCustomerId,
      { subscriptionIds: [] }
    );

    return NextResponse.json({ url: result?.urls?.general?.overview ?? result?.url ?? null });
  } catch (error) {
    console.error("Paddle portal error:", error);
    return NextResponse.json(
      { error: "Failed to generate billing portal link" },
      { status: 500 }
    );
  }
}
