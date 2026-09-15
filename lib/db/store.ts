import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { createSeed } from "./seed";
import type { Database } from "./types";

function isServerless(): boolean {
  return Boolean(
    process.env.NETLIFY ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT ||
      process.env.VERCEL,
  );
}

const DATA_DIR = isServerless() ? path.join("/tmp", "ungalil-oruvan") : path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

let inMemoryFallback: Database | null = null;

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

export function loadDb(): Database {
  ensureDir();
  if (existsSync(DB_PATH)) {
    try {
      const db = JSON.parse(readFileSync(DB_PATH, "utf8")) as Database;
      let shouldPersist = false;
      if (!db.navigation_items || !Array.isArray(db.navigation_items)) {
        db.navigation_items = createSeed().navigation_items;
        shouldPersist = true;
      }
      if (!db.contact_messages || !Array.isArray(db.contact_messages)) {
        db.contact_messages = [];
        shouldPersist = true;
      }
      if (!db.batches || !Array.isArray(db.batches)) {
        db.batches = createSeed().batches;
        shouldPersist = true;
      }
      if (db.product_variants) {
        for (const v of db.product_variants) {
          if (v.stock_qty === undefined) {
            v.stock_qty = v.status === "active" ? 50 : 0;
            shouldPersist = true;
          }
        }
      }
      if (db.pages && db.pages.some((p) => p.body.includes("Development placeholder"))) {
        db.pages = createSeed().pages;
        shouldPersist = true;
      }
      if (db.faqs && db.faqs.some((f) => f.answer.includes("Stage 1") || f.answer.includes("Stage 2"))) {
        db.faqs = createSeed().faqs;
        shouldPersist = true;
      }
      if (shouldPersist) {
        persist(db);
      }
      inMemoryFallback = db;
      return db;
    } catch {
      // Read or parse error, fallback below
    }
  }
  if (inMemoryFallback) return inMemoryFallback;
  const seed = createSeed();
  persist(seed);
  inMemoryFallback = seed;
  return seed;
}

export function persist(db: Database) {
  inMemoryFallback = db;
  try {
    ensureDir();
    writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch {
    // Serverless filesystems may be read-only outside /tmp; keep the in-memory copy.
  }
}

export function mutate<T>(fn: (db: Database) => T): T {
  const db = loadDb();
  const result = fn(db);
  persist(db);
  return result;
}

export function resetDb(): Database {
  const seed = createSeed();
  persist(seed);
  return seed;
}

export function getDbPath() {
  return DB_PATH;
}
