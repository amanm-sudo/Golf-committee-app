import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { simulateDraw } from "@/lib/draw-engine";
import { format } from "date-fns";

async function checkAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return null;
  return user;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const admin = await checkAdmin(supabase);
  if (!admin) return new NextResponse("Forbidden", { status: 403 });

  const { draw_type, weighting_direction } = await request.json();
  const cycle_month = format(new Date(), "yyyy-MM-01"); // First of current month

  try {
    const result = await simulateDraw({ cycle_month, draw_type, weighting_direction });
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Draw simulation error:", err);
    return new NextResponse(err.message || "Simulation failed", { status: 500 });
  }
}
