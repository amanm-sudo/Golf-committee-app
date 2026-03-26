import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

async function checkAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return null;
  return user;
}

// GET: List all users
export async function GET() {
  const supabase = await createClient();
  const admin = await checkAdmin(supabase);
  if (!admin) return new NextResponse("Forbidden", { status: 403 });

  // Use service role to bypass RLS
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, full_name, email, role, charity_id, created_at")
    .order("created_at", { ascending: false });

  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}

// PATCH: Update a specific user's role or charity
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const admin = await checkAdmin(supabase);
  if (!admin) return new NextResponse("Forbidden", { status: 403 });

  const body = await request.json();
  const { userId, role } = body;

  if (!userId) return new NextResponse("userId required", { status: 400 });

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const updates: Record<string, any> = {};
  if (role !== undefined) updates.role = role;

  const { error } = await supabaseAdmin.from("users").update(updates).eq("id", userId);
  if (error) return new NextResponse(error.message, { status: 500 });

  return NextResponse.json({ success: true });
}
