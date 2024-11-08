import { eq, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { name } = getRouterParams(event);
  if (!name) throw createError({ statusCode: 400, message: "Invalid package name" });
  const DB = useDb();
  const pkg = await DB.select().from(tables.packages).where(eq(tables.packages.name, name)).get();

  if (!pkg) throw createError({ statusCode: 404, message: "Package not found" });

  const users = await DB.select({
    ghId: tables.users.ghId,
    ghUser: tables.users.ghUser,
    ghName: tables.users.name,
    count: tables.lists.count
  }).from(tables.lists).innerJoin(tables.users, eq(tables.lists.ghId, tables.users.ghId)).where(eq(tables.lists.packageId, pkg.id)).orderBy(desc(tables.lists.count)).all();

  const npm = await $fetch<NPMPackage>(`https://registry.npmjs.org/${name}`).catch(() => null);

  return {
    ...pkg,
    users,
    npm: npm ? { description: npm.description, homepage: npm.homepage, keywords: npm.keywords } : {}
  };
});
