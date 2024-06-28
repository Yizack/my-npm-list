import { desc, eq, count, sum } from "drizzle-orm";

export default defineEventHandler(async () => {
  const DB = useDb();
  const users = await DB.select().from(tables.users).orderBy(desc(tables.users.joined)).limit(10).all();

  const packages_users = await DB.select({
    name: tables.packages.name,
    count: count()
  }).from(tables.lists).innerJoin(tables.packages, eq(tables.lists.packageId, tables.packages.id)).groupBy(tables.lists.packageId).orderBy(desc(tables.packages.lastFetch), desc(count())).limit(5).all();

  const packages_used = await DB.select({
    name: tables.packages.name,
    count: sum(tables.lists.count)
  }).from(tables.lists).innerJoin(tables.packages, eq(tables.lists.packageId, tables.packages.id)).groupBy(tables.lists.packageId).orderBy(desc(tables.packages.lastFetch), desc(sum(tables.lists.count))).limit(5).all();

  return { users, packages_users, packages_used };
});
