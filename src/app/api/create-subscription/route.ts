import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { planId } = await request.json();

  if (!planId) {
    return new NextResponse("Plan ID is required", { status: 400 });
  }

  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      quantity: 1,
      total_count: 12, // 12 billing cycles (1 year for monthly, ~12 for annual)
      notes: {
        user_id: user.id,
        user_email: user.email || "",
      },
    });

    return NextResponse.json({ subscriptionId: subscription.id });
  } catch (err: any) {
    console.error("Razorpay subscription creation error:", err);
    return new NextResponse(err.error?.description || "Failed to create subscription", { status: 500 });
  }
}
