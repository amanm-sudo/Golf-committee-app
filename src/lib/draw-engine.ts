import { createClient } from "@supabase/supabase-js";

// Use service role key for administrative draw operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function simulateDraw({
  cycle_month,
  draw_type,
  weighting_direction = null,
}: {
  cycle_month: string;
  draw_type: "random" | "algorithmic";
  weighting_direction?: "most_frequent" | "least_frequent" | null;
}) {
  // 1. Generate Winning Numbers
  let winningNumbers: number[] = [];

  if (draw_type === "random") {
    while (winningNumbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!winningNumbers.includes(num)) {
        winningNumbers.push(num);
      }
    }
  } else if (draw_type === "algorithmic") {
    // Frequency histogram logic
    const { data: allScores } = await supabase.from("scores").select("score");
    const counts: Record<number, number> = {};
    allScores?.forEach(({ score }) => {
      counts[score] = (counts[score] || 0) + 1;
    });

    const entries = Object.entries(counts).map(([score, count]) => ({
      score: parseInt(score),
      count,
    }));

    if (weighting_direction === "most_frequent") {
      entries.sort((a, b) => b.count - a.count);
    } else {
      entries.sort((a, b) => a.count - b.count);
    }

    // Pick top/bottom 5 with +- 2 random variance
    winningNumbers = entries.slice(0, 5).map((e) => {
      const variance = Math.floor(Math.random() * 5) - 2; // -2 to +2
      let val = e.score + variance;
      // Clamp to 1-45
      val = Math.max(1, Math.min(45, val));
      return val;
    });

    // Ensure unique
    winningNumbers = Array.from(new Set(winningNumbers));
    while (winningNumbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!winningNumbers.includes(num)) winningNumbers.push(num);
    }
  }

  // 2. Fetch Active Subscribers
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("user_id, status")
    .eq("status", "active");

  const activeUserIds = subs?.map((s) => s.user_id) || [];

  // Exclude Admins
  const { data: adminUsers } = await supabase
    .from("users")
    .select("id")
    .eq("role", "admin");
  const adminIds = adminUsers?.map((a) => a.id) || [];
  const subscriberIds = activeUserIds.filter((id) => !adminIds.includes(id));

  // 3. For each subscriber, get their 5 scores and compare
  const results = [];
  const { data: scores } = await supabase
    .from("scores")
    .select("user_id, score")
    .in("user_id", subscriberIds);

  const scoresByUser: Record<string, number[]> = {};
  scores?.forEach(({ user_id, score }) => {
    if (!scoresByUser[user_id]) scoresByUser[user_id] = [];
    if (scoresByUser[user_id].length < 5) {
      scoresByUser[user_id].push(score);
    }
  });

  const winners = { tier5: [], tier4: [], tier3: [] } as any;

  for (const userId of subscriberIds) {
    const userScores = scoresByUser[userId] || [];
    if (userScores.length < 5) continue; // Must have 5 scores to qualify

    // Order doesn't matter — set comparison
    const matchCount = userScores.filter((num) => winningNumbers.includes(num)).length;

    if (matchCount === 5) winners.tier5.push(userId);
    else if (matchCount === 4) winners.tier4.push(userId);
    else if (matchCount === 3) winners.tier3.push(userId);

    results.push({
      user_id: userId,
      scores_snapshot: userScores,
      matched_count: matchCount,
    });
  }

  // 4. Calculate Pools
  // Sum up (subscription * 0.6) - charity_share
  // Simplified for now: count subs * avg prize contribution
  // In reality, each user has a charity_percentage (10-50%)
  // Spec: "Subscription prices: ₹9.99/month · ₹99.99/year"
  // Spec: "Prize pool contribution: 60% of net subscripton (after charity share)"
  const { data: userConfigs } = await supabase
    .from("users")
    .select("id, charity_percentage")
    .in("id", subscriberIds);

  const totalPoolContribution = userConfigs?.reduce((acc, user) => {
    const charityPercentage = user.charity_percentage / 100;
    const net = 9.99 * (1 - charityPercentage); // Assume monthly for simplified simulation
    return acc + net * 0.6;
  }, 0) || 0;

  // Get rollover from previous draw
  const { data: lastDraw } = await supabase
    .from("draws")
    .select("jackpot_rollover_out")
    .order("cycle_month", { ascending: false })
    .limit(1)
    .single();

  const jackpotRolloverIn = lastDraw?.jackpot_rollover_out || 0;
  const totalPool = totalPoolContribution + jackpotRolloverIn;

  const pools = {
    tier5: totalPool * 0.4,
    tier4: totalPool * 0.35,
    tier3: totalPool * 0.25,
  };

  const payoutPerWinner = {
    tier5: winners.tier5.length > 0 ? pools.tier5 / winners.tier5.length : 0,
    tier4: winners.tier4.length > 0 ? pools.tier4 / winners.tier4.length : 0,
    tier3: winners.tier3.length > 0 ? pools.tier3 / winners.tier3.length : 0,
  };

  const jackpotRolloverOut = winners.tier5.length === 0 ? pools.tier5 : 0;

  return {
    cycle_month,
    draw_type,
    weighting_direction,
    winning_numbers: winningNumbers,
    matches: results,
    winners,
    pools,
    payoutPerWinner,
    total_pool: totalPool,
    jackpot_rollover_in: jackpotRolloverIn,
    jackpot_rollover_out: jackpotRolloverOut,
  };
}
