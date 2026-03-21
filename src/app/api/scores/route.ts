import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { score, scored_at } = await request.json();

  // Validate range 1-45
  if (score < 1 || score > 45) {
    return new NextResponse("Score must be between 1 and 45", { status: 400 });
  }

  // Validate date (not in future)
  if (new Date(scored_at) > new Date()) {
    return new NextResponse("Scored date cannot be in the future", { status: 400 });
  }

  // Check current scores
  const { data: currentScores } = await supabase
    .from("scores")
    .select("id, scored_at")
    .eq("user_id", user.id)
    .order("scored_at", { ascending: true });

  if (currentScores && currentScores.length >= 5) {
    // Delete the oldest score
    const oldestScoreId = currentScores[0].id;
    await supabase.from("scores").delete().eq("id", oldestScoreId);
  }

  // Insert new score
  const { data, error } = await supabase.from("scores").insert({
    user_id: user.id,
    score,
    scored_at,
  }).select().single();

  if (error) {
    return new NextResponse(error.message, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", user.id)
    .order("scored_at", { ascending: false });

  if (error) {
    return new NextResponse(error.message, { status: 500 });
  }

  return NextResponse.json(data);
}
