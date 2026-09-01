import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env, requireServiceRole } from "@/lib/env";

/** Service-role client. Server only. Never import from client components. */
export function createAdminClient() {
  const key = requireServiceRole();
  return createClient(env.supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
