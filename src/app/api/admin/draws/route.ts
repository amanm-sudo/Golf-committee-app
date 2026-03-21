import { NextResponse } from "next/server";
import { sendWinnerNotification } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

async function checkAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return null;
  return user;
}

// GET: list all draws
export async function GET() {
  const supabase = await createClient();
  const admin = await checkAdmin(supabase);
  if (!admin) return new NextResponse("Forbidden", { status: 403 });

  const { data, error } = await supabase
    .from("draws")
    .select("*")
    .order("cycle_month", { ascending: false });

  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}

// POST: publish a draw (from simulation result)
export async function POST(request: Request) {
  const supabase = await createClient();
  const admin = await checkAdmin(supabase);
  if (!admin) return new NextResponse("Forbidden", { status: 403 });

  const body = await request.json();
  const {
    cycle_month,
    draw_type,
    weighting_direction,
    winning_numbers,
    total_pool,
    jackpot_rollover_in,
    jackpot_rollover_out,
    pools,
    matches,
    winners,
    payoutPerWinner,
  } = body;

  // 1. Create the draw record
  const { data: draw, error: drawError } = await supabase
    .from("draws")
    .insert({
      cycle_month,
      status: "published",
      draw_type,
      weighting_direction: weighting_direction || null,
      winning_numbers,
      total_pool,
      jackpot_rollover_in: jackpot_rollover_in || 0,
      jackpot_rollover_out: jackpot_rollover_out || 0,
      tier_5_pool: pools?.tier5 || 0,
      tier_4_pool: pools?.tier4 || 0,
      tier_3_pool: pools?.tier3 || 0,
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (drawError) return new NextResponse(drawError.message, { status: 500 });

  // 2. Insert draw entries
  if (matches && matches.length > 0) {
    const entries = matches.map((m: any) => ({
      draw_id: draw.id,
      user_id: m.user_id,
      scores_snapshot: m.scores_snapshot,
      matched_count: [3, 4, 5].includes(m.matched_count) ? m.matched_count : 0,
      prize_amount:
        m.matched_count === 5 ? payoutPerWinner?.tier5 || 0
        : m.matched_count === 4 ? payoutPerWinner?.tier4 || 0
        : m.matched_count === 3 ? payoutPerWinner?.tier3 || 0
        : 0,
    }));

    await supabase.from("draw_entries").insert(entries);
  }

  // 3. Insert winners
  const winnerInserts: any[] = [];
  for (const userId of (winners?.tier5 || [])) {
    winnerInserts.push({ draw_id: draw.id, user_id: userId, tier: 5, prize_amount: payoutPerWinner?.tier5 || 0, status: "pending_verification" });
  }
  for (const userId of (winners?.tier4 || [])) {
    winnerInserts.push({ draw_id: draw.id, user_id: userId, tier: 4, prize_amount: payoutPerWinner?.tier4 || 0, status: "pending_verification" });
  }
  for (const userId of (winners?.tier3 || [])) {
    winnerInserts.push({ draw_id: draw.id, user_id: userId, tier: 3, prize_amount: payoutPerWinner?.tier3 || 0, status: "pending_verification" });
  }

  if (winnerInserts.length > 0) {
    await supabase.from("winners").insert(winnerInserts);

    // Fetch the emails and names of the winners we just inserted
    const winnerIds = winnerInserts.map(w => w.user_id);
    const { data: usersData } = await supabase
      .from("users")
      .select("id, email, full_name")
      .in("id", winnerIds);

    // Send the email notification to each winner in the background
    if (usersData) {
      for (const w of winnerInserts) {
        const user = usersData.find(u => u.id === w.user_id);
        if (user && user.email) {
          sendWinnerNotification(
            user.email,
            user.full_name || "Member",
            w.tier,
            w.prize_amount,
            cycle_month
          );
        }
      }
    }
  }

  return NextResponse.json({ success: true, drawId: draw.id });
}
