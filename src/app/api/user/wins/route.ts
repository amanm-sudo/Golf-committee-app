import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Fetch the current user's wins/prize history
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data, error } = await supabase
    .from("winners")
    .select("*, draws(cycle_month, winning_numbers)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return new NextResponse(error.message, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// PATCH: Allow user to upload proof URL for their won draw
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { winId, proof_url } = await request.json();

  if (!winId || !proof_url) {
    return new NextResponse("winId and proof_url required", { status: 400 });
  }

  // Only allow updating proof for this user's own wins
  const { error } = await supabase
    .from("winners")
    .update({ proof_url })
    .eq("id", winId)
    .eq("user_id", user.id)
    .eq("status", "pending_verification"); // Can only upload proof when pending

  if (error) {
    return new NextResponse(error.message, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
