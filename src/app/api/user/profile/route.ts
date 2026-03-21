import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*, charities(name, slug, logo_url)")
    .eq("id", user.id)
    .single();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Calculate total donated from donations table
  const { data: donations } = await supabase
    .from("donations")
    .select("amount")
    .eq("user_id", user.id);

  const totalDonated = donations?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      full_name: profile?.full_name || user.user_metadata?.full_name || "Member",
      role: profile?.role || "subscriber",
      charity: profile?.charities || null,
    },
    // Legacy fields for CharityWidget compatibility
    charity: profile?.charities || null,
    charity_percentage: profile?.charity_percentage || 10,
    total_donated: totalDonated,
    subscription: subscription || null,
  });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const updates: Record<string, any> = {};

  if (body.charity_percentage !== undefined) {
    const pct = Number(body.charity_percentage);
    if (pct < 10 || pct > 50) {
      return new NextResponse("Charity percentage must be between 10 and 50", { status: 400 });
    }
    updates.charity_percentage = pct;
  }

  if (body.charity_id !== undefined) {
    updates.charity_id = body.charity_id;
  }

  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return new NextResponse(error.message, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
