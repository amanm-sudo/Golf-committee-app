import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function checkAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return null;
  return user;
}

export async function GET() {
  const supabase = await createClient();
  const admin = await checkAdmin(supabase);
  if (!admin) return new NextResponse("Forbidden", { status: 403 });

  // Active subscribers count
  const { count: active_subscribers } = await supabase
    .from("subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  // Pending winner verifications
  const { count: pending_count } = await supabase
    .from("winners")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending_verification");

  // Total charity contributions
  const { data: donations } = await supabase
    .from("donations")
    .select("amount");
  const charity_impact = donations?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;

  // Approximate current prize pool (60% of net active subscription revenue)
  const monthlyRevenue = (active_subscribers || 0) * 9.99;
  const total_pool = monthlyRevenue * 0.6 * 0.9; // Simplified estimate

  return NextResponse.json({
    active_subscribers: active_subscribers || 0,
    pending_count: pending_count || 0,
    charity_impact: Math.round(charity_impact * 100) / 100,
    total_pool: Math.round(total_pool * 100) / 100,
  });
}
