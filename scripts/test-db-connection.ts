import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

// Load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    process.env[key] = val;
  }
}

async function test() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  console.log("Connecting to:", url);

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Create storage buckets
  const bucketList = [
    { id: "product-images", public: true },
    { id: "marketing", public: true },
    { id: "private-docs", public: false },
  ];
  for (const b of bucketList) {
    const { error: bErr } = await supabase.storage.createBucket(b.id, { public: b.public });
    if (bErr) console.log(`Bucket ${b.id}:`, bErr.message);
    else console.log(`Bucket '${b.id}' created successfully!`);
  }

  // Check auth users
  const { data: users, error: uErr } = await supabase.auth.admin.listUsers();
  if (uErr) {
    console.error("Auth error:", uErr.message);
  } else {
    console.log("Auth users count:", users.users.length);
  }

  // Check rest endpoint
  const { data: cats, error: cErr } = await supabase.from("categories").select("*");
  if (cErr) {
    console.log("Categories query result:", cErr.message);
  } else {
    console.log("Categories count:", cats.length);
  }
}

test().catch(console.error);
