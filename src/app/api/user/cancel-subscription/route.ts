import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// POST: Cancel the current user's active subscription
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Fetch the subscription record
  const { data: subscription, error: subError } = await supabase
    .from("subscriptions")
    .select("razorpay_subscription_id, status")
    .eq("user_id", user.id)
    .single();

  if (subError || !subscription) {
    return new NextResponse("No active subscription found", { status: 404 });
  }

  if (subscription.status !== "active") {
    return new NextResponse("Subscription is not active", { status: 400 });
  }

  try {
    // Cancel at period end (graceful cancellation)
    await razorpay.subscriptions.cancel(subscription.razorpay_subscription_id, false);

    // Mark in our DB that the subscription will cancel at period end
    await supabase
      .from("subscriptions")
      .update({ cancel_at_period_end: true })
      .eq("user_id", user.id);

    return NextResponse.json({ success: true, message: "Subscription will cancel at end of billing period." });
  } catch (err: any) {
    console.error("Razorpay cancellation error:", err);
    return new NextResponse(err.error?.description || "Failed to cancel subscription", { status: 500 });
  }
}
