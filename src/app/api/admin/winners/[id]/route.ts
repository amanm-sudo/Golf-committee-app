import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function checkAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return null;
  return user;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const admin = await checkAdmin(supabase);
  if (!admin) return new NextResponse("Forbidden", { status: 403 });

  const { status } = await request.json();
  const validStatuses = ["pending_verification", "verified", "paid", "rejected"];

  if (!validStatuses.includes(status)) {
    return new NextResponse("Invalid status", { status: 400 });
  }

  const updates: Record<string, any> = {
    status,
    reviewed_at: new Date().toISOString(),
    reviewed_by: (await supabase.auth.getUser()).data.user?.id,
  };

  const { error } = await supabase
    .from("winners")
    .update(updates)
    .eq("id", params.id);

  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json({ success: true });
}
