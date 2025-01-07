import type { DrizzleD1Database } from "drizzle-orm/d1";
import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

// @ts-expect-error - no types
import Database from "better-sqlite3";

export * as tables from "../db/schema";

let _db: DrizzleD1Database | BetterSQLite3Database | null = null;

export const useDB = () => {
  if (!_db) {
    // @ts-expect-error globalThis.__env__ is not defined
    const binding = process.env.DB || globalThis.__env__?.DB || globalThis.DB
    if (binding) {
      // d1 in production
      _db = drizzleD1(binding);
    }
    else if (import.meta.dev) {
      // local sqlite in development
      const sqlite = new Database("server/db/db.sqlite");
      _db = drizzle(sqlite);
    }
    else {
      throw createError({
        statusCode: 500,
        message: "No database configured for production"
      });
    }
  }
  return _db as DrizzleD1Database;
};
