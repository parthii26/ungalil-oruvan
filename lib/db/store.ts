import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { createSeed } from "./seed";
import type { Database } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

let cache: Database | null = null;

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

export function loadDb(): Database {
  if (cache) return cache;
  ensureDir();
  if (!existsSync(DB_PATH)) {
    cache = createSeed();
    persist(cache);
    return cache;
  }
  try {
    cache = JSON.parse(readFileSync(DB_PATH, "utf8")) as Database;
    return cache;
  } catch {
    cache = createSeed();
    persist(cache);
    return cache;
  }
}

export function persist(db: Database) {
  ensureDir();
  cache = db;
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

export function mutate<T>(fn: (db: Database) => T): T {
  const db = loadDb();
  const result = fn(db);
  persist(db);
  return result;
}

export function resetDb(): Database {
  cache = createSeed();
  persist(cache);
  return cache;
}

export function getDbPath() {
  return DB_PATH;
}
