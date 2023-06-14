import { eq, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { name } = getRouterParams(event);
  const DB = useDb();
  const pkg = await DB.select().from(tables.packages).where(eq(tables.packages.name, name)).get();
  const users = await DB.select({
    ghId: tables.users.ghId,
    ghUser: tables.users.ghUser,
    ghName: tables.users.name,
    count: tables.lists.count
  }).from(tables.lists).innerJoin(tables.users, eq(tables.lists.ghId, tables.users.ghId)).where(eq(tables.lists.packageId, pkg.id)).orderBy(desc(tables.lists.count)).all();

  return { ...pkg, users };
});
