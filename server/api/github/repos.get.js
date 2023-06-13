import { eq, and } from "drizzle-orm";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user) {
    return sendRedirect(event, "/");
  }
  const config = useRuntimeConfig(event);
  const { code } = getQuery(event);
  if (!code) {
    const redirectUrl = getRequestURL(event).href;
    return sendRedirect(event, `https://github.com/login/oauth/authorize?client_id=${config.github.clientId}&redirect_uri=${redirectUrl}`);
  }

  const response = await $fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    body: {
      client_id: config.github.clientId,
      client_secret: config.github.clientSecret,
      code
    }
  });
  if (response.error) {
    return sendRedirect(event, "/");
  }

  const ghRepos = await $fetch("https://api.github.com/user/repos", {
    headers: {
      "User-Agent": `Github-OAuth-${config.github.clientId}`,
      Authorization: `token ${response.access_token}`
    },
    query: {
      affiliation: "owner",
      visibility: "public",
      sort: "updated",
      per_page: 100,
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

  return sendRedirect(event, `/user/${user.ghUser}`);
});
