import { desc } from "drizzle-orm";

export default defineEventHandler(async () => {
  const DB = useDB();
  const users = await DB.select().from(tables.users).orderBy(desc(tables.users.joined)).limit(15).all();

  return { users };
});
