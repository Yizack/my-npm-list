import { eq, desc, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = getRouterParams(event);
  const { props } = getQuery(event);
  const DB = useDb();

  type KeyOfTablesUsers = keyof typeof tables.users;

  const columns = {} as Record<KeyOfTablesUsers, any>;
  if (props) {
    const propsArray = props.toString().split(",") as KeyOfTablesUsers[];
    propsArray.forEach((prop) => {
      if (tables.users[prop]) {
        columns[prop] = tables.users[prop];
      }
    });
  }

  const userData = await DB.select(columns).from(tables.users).where(sql`lower(${tables.users.ghUser}) like lower(${user})`).get();

  if (!userData) {
    return { packages: [] };
  }

  const userPackages = await DB.select({
    id: tables.packages.id,
    name: tables.packages.name,
    added: tables.packages.added,
    lastFetch: tables.packages.lastFetch,
    versions: tables.lists.versions,
    count: tables.lists.count
  }).from(tables.lists).innerJoin(tables.packages, eq(tables.lists.packageId, tables.packages.id)).where(eq(tables.lists.ghId, userData.ghId)).orderBy(desc(tables.lists.count)).all();
  return { ...userData, packages: userPackages };
});
