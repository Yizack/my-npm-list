import { desc } from "drizzle-orm";

export default defineEventHandler(async () => {
  const DB = useDb();
  return await DB.select().from(tables.users).orderBy(desc(tables.users.joined)).limit(10).all();
});
