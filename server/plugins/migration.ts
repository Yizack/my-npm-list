import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

export default defineNitroPlugin(() => {
  if (import.meta.dev) {
    try {
      const DB = useDB() as unknown as BetterSQLite3Database;
      migrate(DB, { migrationsFolder: "./server/db/migrations" });
    }
    catch (err) {
      console.info("Cannot migrate database", err);
    }
  }
});
