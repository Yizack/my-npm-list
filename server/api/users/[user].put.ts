import { eq, and, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);
  const { user, secure } = await requireUserSession(event);
  if (!secure?.access_token) throw createError({ status: 401, message: "Unauthorized" });

  if (!user || !params || params.user !== user.ghUser) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const body = await readBody(event);
  const DB = useDb();

  const update = await DB.update(tables.users).set({
    name: body.name,
    bio: body.bio ? body.bio : null,
    country: body.country ? body.country : null,
    website: body.website ? body.website : null
  }).where(and(eq(tables.users.ghId, user.ghId), sql`lower(${tables.users.ghUser}) like lower(${user.ghUser})`)).returning().get();

  await setUserSessionNullable(event, { user: update, secure });
  return update;
});
