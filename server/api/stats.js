import { sql, desc, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const DB = useDb();

  const packages = DB.select({ pCount: sql`COUNT(*)`.as("p_count") }).from(tables.packages).as("p");
  const users = DB.select({ uCount: sql`COUNT(*)`.as("u_count") }).from(tables.users).as("u");
  const lists = DB.select({ lCount: sql`COUNT(*)`.as("l_count") }).from(tables.lists).as("l");

  const mp = DB.select({
    name: sql`${tables.users.ghUser}`.as("name_p"),
    count: sql`COUNT(*)`.as("max_p")
  }).from(tables.lists).innerJoin(tables.users, eq(tables.lists.ghId, tables.users.ghId)).groupBy(tables.lists.ghId).orderBy(desc(sql`COUNT(*)`)).limit(1).as("mp");

  const mc = DB.select({
    name: sql`${tables.packages.name}`.as("name_c"),
    count: sql`MAX(${tables.lists.count})`.as("max_c")
  }).from(tables.lists).innerJoin(tables.packages, eq(tables.lists.packageId, tables.packages.id)).as("mc");

  const mu = DB.select({
    name: sql`${tables.packages.name}`.as("name_u"),
    count: sql`COUNT(*)`.as("max_u")
  }).from(tables.lists).innerJoin(tables.packages, eq(tables.lists.packageId, tables.packages.id)).groupBy(tables.lists.packageId).orderBy(desc(sql`COUNT(*)`)).limit(1).as("mu");

  const counters = await DB.select({
    packages: packages.pCount,
    users: users.uCount,
    lists: lists.lCount,
    max: {
      mostPackageCount: {
        ref: mp.name,
        count: mp.count
      },
      usedPackageNumber: {
        ref: mc.name,
        count: mc.count
      },
      usedPackageUsers: {
        ref: mu.name,
        count: mu.count
      }
    }
  }).from([packages, users, lists, mp, mc, mu]).get();

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
      value: counters.max.mostPackageCount.count,
      ref: counters.max.mostPackageCount.ref,
      type: "user",
      description: "Package count of the user with the most packages in their list"
    },
    {
      value: counters.max.usedPackageNumber.count,
      ref: counters.max.usedPackageNumber.ref,
      type: "package",
      description: "Maximum number of times a single package has been used by a user"
    },
    {
      value: counters.max.usedPackageUsers.count,
      ref: counters.max.usedPackageUsers.ref,
      type: "package",
      description: "Package used by the most users"
    }
  ];
});
