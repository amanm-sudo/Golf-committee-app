import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { sendSubscriptionConfirmation } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("X-Razorpay-Signature");

  if (!signature) {
    return new NextResponse("No signature found", { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);
  const supabase = await createClient();

  try {
    switch (event.event) {
      case "subscription.charged": {
        const subscription = event.payload.subscription.entity;
        const payment = event.payload.payment.entity;

        // Extract internal user ID from notes (added during checkout creation)
        const userId = subscription.notes?.user_id;

        if (userId) {
          const { error } = await supabase
            .from("subscriptions")
            .upsert({
              user_id: userId,
              razorpay_subscription_id: subscription.id,
              status: "active",
              plan_type: subscription.plan_id === process.env.RAZORPAY_YEARLY_PLAN_ID ? "yearly" : "monthly",
              current_period_end: new Date(subscription.current_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end || false,
            });

          if (error) throw error;

          // Fetch user email to send receipt
          const { data: userRecord } = await supabase
            .from("users")
            .select("email")
            .eq("id", userId)
            .single();

          if (userRecord?.email) {
            const planName = subscription.plan_id === process.env.RAZORPAY_YEARLY_PLAN_ID ? "Annual Legacy" : "Monthly Heritage";
            const amountStr = `₹${(payment.amount / 100).toFixed(2)}`;
            sendSubscriptionConfirmation(userRecord.email, planName, amountStr);
          }
        }
        break;
      }
      
      case "subscription.halted":
      case "subscription.cancelled": {
        const subscription = event.payload.subscription.entity;
        
        await supabase
          .from("subscriptions")
          .update({
             status: event.event === "subscription.halted" ? "past_due" : "cancelled",
             cancel_at_period_end: subscription.cancel_at_period_end || false, 
          })
          .eq("razorpay_subscription_id", subscription.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
