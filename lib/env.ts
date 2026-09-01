import "server-only";

function read(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const env = {
  siteUrl: read("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  appEnv: read("APP_ENV", "development"),
  authSecret: read("AUTH_SECRET", "varizel-dev-auth-secret-change-in-production-32"),
  supabaseUrl: read("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: read("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: read("SUPABASE_SERVICE_ROLE_KEY"),
};

export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function requireServiceRole(): string {
  if (!env.supabaseServiceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is server-only and is not configured.");
  }
  return env.supabaseServiceRoleKey;
}
