import { desc } from "drizzle-orm";
import { index, sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  ghId: integer("gh_id").primaryKey(),
  ghUser: text("gh_user").notNull(),
  name: text("name").notNull(),
  bio: text("bio"),
  website: text("website"),
  country: text("country"),
  joined: integer("joined"),
  listUpdated: integer("list_updated")
}, table => [
  uniqueIndex("gh_user_index").on(table.ghUser)
]);

export const packages = sqliteTable("packages", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  added: integer("added").notNull(),
  lastFetch: integer("last_fetch").notNull()
}, table => [
  uniqueIndex("package_name_index").on(table.name)
]);

export const lists = sqliteTable("lists", {
  id: integer("id").primaryKey(),
  ghId: integer("gh_id").notNull().references(() => users.ghId),
  packageId: integer("package_id").notNull().references(() => packages.id),
  versions: text("versions").notNull(),
  count: integer("count").notNull()
}, table => [
  uniqueIndex("gh_id_package_id_unique_index").on(table.ghId, table.packageId),
  index("gh_count_index").on(table.ghId, desc(table.count)),
  index("package_id_index").on(table.packageId)
]);
