import { eq, and, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);
  const { user, ghTokens } = await requireUserSession(event);

  if (!user && !params && params.user !== user.ghUser) {
    throw createError({
      status: 401,
      message: "Unauthorized"
    });
  }

  const body = await readBody(event);
  const DB = useDb();

  await setUserSession(event, { user: body, ghTokens });

  return await DB.update(tables.users).set({
    name: body.name,
    bio: body.bio,
    country: body.country,
    website: body.website
  }).where(and(eq(tables.users.ghId, user.ghId), sql`lower(${tables.users.ghUser}) like lower(${user.ghUser})`)).returning().get();
});
