import { eq, asc, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = getRouterParams(event);
  const { props } = getQuery(event);
  const DB = useDb();
  let userSelect = DB.select();

  if (props) {
    const propsArray = props.split(",");
    const columns = {};
    propsArray.forEach((prop) => {
      if (tables.users[prop]) {
        columns[prop] = tables.users[prop];
      }
    });
    userSelect = DB.select(columns);
  }

  const userData = await userSelect.from(tables.users).where(sql`lower(${tables.users.ghUser}) like lower(${user})`).get();

  const userPackages = await DB.select({
    id: tables.packages.id,
    name: tables.packages.name,
    added: tables.packages.added,
    lastFetch: tables.packages.lastFetch,
    versions: tables.lists.versions,
    count: tables.lists.count
  }).from(tables.lists).innerJoin(tables.packages, eq(tables.lists.packageId, tables.packages.id)).where(eq(tables.lists.ghId, userData.ghId)).orderBy(asc(tables.packages.name)).all();
  return { ...userData, packages: userPackages };
});
