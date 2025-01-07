import { sql, desc, eq, count, max } from "drizzle-orm";

export default defineEventHandler(async (): Promise<SiteStats[]> => {
  const DB = useDB();

  const packages = DB.select({ count: count().as("count") }).from(tables.packages).as("p");
  const users = DB.select({ count: count() }).from(tables.users);
  const lists = DB.select({ count: count() }).from(tables.lists);

  const mostPackagesUser = DB.select({
    ghUser: tables.users.ghUser,
    count: count()
  }).from(tables.lists).innerJoin(tables.users, eq(tables.lists.ghId, tables.users.ghId)).groupBy(tables.lists.ghId).orderBy(desc(count())).limit(1);

  const maxPackageUser = DB.select({
    name: tables.packages.name,
    count: max(tables.lists.count).as("count")
  }).from(tables.lists).innerJoin(tables.packages, eq(tables.lists.packageId, tables.packages.id));

  const mostUsedPackage = DB.select({
    name: sql`${tables.packages.name}`.as("name"),
    count: count()
  }).from(tables.lists).innerJoin(tables.packages, eq(tables.lists.packageId, tables.packages.id)).groupBy(tables.lists.packageId).orderBy(desc(tables.packages.lastFetch), desc(count())).limit(1);

  const counters = await DB.select({
    packages: packages.count,
    users: sql<number>`${users}`,
    lists: sql<number>`${lists}`,
    mostPackagesUser: {
      ref: sql<number>`(SELECT gh_user FROM (${mostPackagesUser}))`,
      count: sql<number>`(SELECT count FROM (${mostPackagesUser}))`
    },
    maxPackageUser: {
      ref: sql<number>`(SELECT name FROM (${maxPackageUser}))`,
      count: sql<number>`(SELECT count FROM (${maxPackageUser}))`
    },
    mostUsedPackage: {
      ref: sql<number>`(SELECT name FROM (${mostUsedPackage}))`,
      count: sql<number>`(SELECT count FROM (${mostUsedPackage}))`
    }
  }).from(packages).get();

  if (!counters) {
    throw createError({
      statusCode: 500,
      message: "Could not fetch counters"
    });
  }

  return [
    {
      value: counters.packages,
      description: "Unique packages fetched by all users"
    },
    {
      value: counters.users,
      description: "Number of registered users"
    },
    {
      value: counters.lists,
      description: "Total number of packages in all users list"
    },
    {
      value: counters.mostPackagesUser.count,
      ref: counters.mostPackagesUser.ref,
      type: "user",
      description: "Package count of the user with the most packages in their list"
    },
    {
      value: counters.maxPackageUser.count,
      ref: counters.maxPackageUser.ref,
      type: "package",
      description: "Maximum number of times a single package has been used by a user"
    },
    {
      value: counters.mostUsedPackage.count,
      ref: counters.mostUsedPackage.ref,
      type: "package",
      description: "Package used by the most users"
    }
  ];
});
