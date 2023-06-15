import { sql, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const DB = useDb();
  const packages = DB.select({ pCount: sql`COUNT(*)`.as("p_count") }).from(tables.packages).as("p");
  const users = DB.select({ uCount: sql`COUNT(*)`.as("u_count") }).from(tables.users).as("u");
  const lists = DB.select({ lCount: sql`COUNT(*)`.as("l_count") }).from(tables.lists).as("l");
  const mp = DB.select({
    ghId: tables.lists.ghId,
    maxP: sql`COUNT(*)`.as("max_p")
  }).from(tables.lists).groupBy(tables.lists.ghId).orderBy(desc(2)).limit(1).as("mp");
  const mc = DB.select({
    ghId: tables.lists.ghId,
    maxC: sql`MAX(${tables.lists.count})`.as("max_c")
  }).from(tables.lists).as("mc");

  const counters = await DB.select({
    packages: packages.pCount,
    users: users.uCount,
    lists: lists.lCount,
    maxP: mp.maxP,
    maxC: mc.maxC
  }).from([packages, users, lists, mp, mc]).get();

  return [
    {
      name: "Packages",
      value: counters.packages,
      description: "Unique packages fetched by all users"
    },
    {
      name: "Users",
      value: counters.users,
      description: "Number of users registered"
    },
    {
      name: "Packages in lists",
      value: counters.lists,
      description: "Total number of packages in all users list"
    },
    {
      name: "User with most packages",
      value: counters.maxP,
      description: "Packages count of the user with the most packages in their list"
    },
    {
      name: "Single package used most by an user",
      value: counters.maxC,
      description: "Maximum number of times a single package has been utilized by a user"
    }
  ];
});
