import { eq, and, asc, sql } from "drizzle-orm";

export default eventHandler(async (event) => {
  const { user, ghTokens } = await requireUserSession(event);
  if (!user) {
    throw createError({
      status: 401,
      message: "Unauthorized"
    });
  }

  const config = useRuntimeConfig(event);
  const response = await $fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    body: {
      client_id: config.github.clientId,
      client_secret: config.github.clientSecret,
      grant_type: "refresh_token",
      refresh_token: ghTokens.refresh_token
    }
  });

  if (response.error) {
    throw createError({
      status: 401,
      message: "Unauthorized"
    });
  }

  await setUserSession(event, {
    user,
    ghTokens: {
      refresh_token: response.refresh_token
    }
  });

  const ghRepos = await $fetch("https://api.github.com/user/repos", {
    headers: {
      "User-Agent": `Github-OAuth-${config.github.clientId}`,
      Authorization: `token ${response.access_token}`
    },
    query: {
      affiliation: "owner",
      visibility: "public",
      sort: "updated",
      per_page: 1,
      page: 1
    }
  }).catch(() => []);

  const list = [];
  const today = new Date().getTime();
  const DB = useDb();

  if (ghRepos.length) {
    for (const { name, fork } of ghRepos) {
      if (fork) {
        continue;
      }
      const file = await $fetch(`https://api.github.com/repos/${user.ghUser}/${name}/contents/package.json`, {
        headers: {
          "User-Agent": `Github-OAuth-${config.github.clientId}`,
          Authorization: `token ${response.access_token}`,
          Accept: "application/vnd.github+json"
        }
      }).catch(() => ({}));
      if (!file.content) {
        console.info("No package.json found in", name);
        continue;
      }

      const packageJson = JSON.parse(Buffer.from(file.content, file.encoding).toString());
      const { dependencies, devDependencies } = packageJson;

      for (const [key, value] of Object.entries({ ...dependencies, ...devDependencies })) {
        const dependency = list.find(item => item.name === key);
        if (dependency) {
          dependency.count += 1;
          const dependencyVersion = dependency.versions.find(item => item === value);
          if (!dependencyVersion) {
            dependency.versions.push(value);
          }
          continue;
        }
        const pkg = await DB.insert(tables.packages).values({
          name: key,
          added: today,
          lastFetch: today
        }).onConflictDoUpdate({
          target: tables.packages.name,
          set: {
            added: today,
            lastFetch: today
          }
        }).returning().get();
        list.push({ id: pkg.id, name: key, versions: [value], count: 1 });
      }
    }
  }

  const ids = list.map(item => eq(tables.lists.id, item.id));
  await DB.delete(tables.lists).where(sql`not exists ${DB.select().from(tables.lists).where(and(eq(tables.lists.ghId, user.ghId), ...ids))}`).run();

  for (const { id, versions, count } of list) {
    const exists = await DB.select().from(tables.lists).where(and(eq(tables.lists.ghId, user.ghId), eq(tables.lists.packageId, id))).limit(1).get();

    if (exists) {
      await DB.update(tables.lists).set({
        versions: versions.join(",").replace(/\^/g, ""),
        count
      }).where(and(eq(tables.lists.ghId, user.ghId), eq(tables.lists.packageId, id))).run();
      continue;
    }

    await DB.insert(tables.lists).values({
      ghId: user.ghId,
      packageId: id,
      versions: versions.join(",").replace(/\^/g, ""),
      count
    }).returning().get();
  }

  await DB.update(tables.users).set({
    listUpdated: today
  }).where(eq(tables.users.ghId, user.ghId)).run();

  const userPackages = await DB.select({
    id: tables.packages.id,
    name: tables.packages.name,
    added: tables.packages.added,
    lastFetch: tables.packages.lastFetch,
    versions: tables.lists.versions,
    count: tables.lists.count
  }).from(tables.lists).innerJoin(tables.packages, eq(tables.lists.packageId, tables.packages.id)).where(eq(tables.lists.ghId, user.ghId)).orderBy(asc(tables.packages.name)).all();

  return { packages: userPackages };
});
