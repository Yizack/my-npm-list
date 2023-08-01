import { desc, sql, eq } from "drizzle-orm";

export default defineEventHandler(async () => {
  const DB = useDb();
  const users = await DB.select().from(tables.users).orderBy(desc(tables.users.joined)).limit(10).all();

  const packages_users = await DB.select({
    name: tables.packages.name,
    count: sql`COUNT(*)`
  }).from(tables.lists).innerJoin(tables.packages, eq(tables.lists.packageId, tables.packages.id)).groupBy(tables.lists.packageId).orderBy(desc(tables.packages.lastFetch), desc(sql`COUNT(*)`)).limit(5).all();

  const packages_used = await DB.select({
    name: tables.packages.name,
    count: sql`SUM(${tables.lists.count})`
  }).from(tables.lists).innerJoin(tables.packages, eq(tables.lists.packageId, tables.packages.id)).groupBy(tables.lists.packageId).orderBy(desc(tables.packages.lastFetch), desc(sql`SUM(${tables.lists.count})`)).limit(5).all();

  return { users, packages_users, packages_used };
});
