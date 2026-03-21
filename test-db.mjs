import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

async function test() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const adminEmail = "test2mail@gmail.com";

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars");
    return;
  }

  // 1. We authenticate as a super client just to see what the rows look like
  const adminClient = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  const { data: users, error } = await adminClient.from("users").select("*");
  console.log("ALL USERS VIA SERVICE ROLE:", users, "\nError:", error);

  // 2. If the user is logging in, middleware uses the session. Let's just login as test2mail
  // Wait, we don't know the password. So we can't test RLS exactly without the token.
  
  // But we can check if the row exists and what its role is.
}

test();
