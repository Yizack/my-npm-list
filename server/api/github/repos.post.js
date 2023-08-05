import { eq, desc, and, notInArray, sql } from "drizzle-orm";

export default eventHandler(async (event) => {
  const { user, ghTokens } = await requireUserSession(event);
  if (!user) {
    throw createError({
      status: 401,
      message: "Unauthorized"
    });
  }
  const { ghUser, ghId } = await readBody(event);
  const config = useRuntimeConfig(event);

  const ghRepos = await $fetch(`https://api.github.com/users/${ghUser}/repos`, {
    headers: {
      "User-Agent": `Github-OAuth-${config.github.clientId}`,
      Authorization: `Bearer ${ghTokens.access_token}`
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
      if (fork) continue;
      const file = await $fetch(`https://api.github.com/repos/${ghUser}/${name}/contents/package.json`, {
        headers: {
          "User-Agent": `Github-OAuth-${config.github.clientId}`,
          Authorization: `Bearer ${ghTokens.access_token}`,
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
            lastFetch: today
          }
        }).returning().get();
        list.push({ id: pkg.id, name: key, versions: [value], count: 1 });
      }
    }
  }

  if (!list.length) return { packages: [] };

  const foundPackages = list.map(pkg => pkg.id);

  if (process.dev) {
    await DB.delete(tables.lists).where(and(eq(tables.lists.ghId, ghId), notInArray(tables.lists.packageId, foundPackages))).returning().all();
    await DB.insert(tables.lists).values(list.map(pkg => ({
      ghId,
      packageId: pkg.id,
      versions: pkg.versions.join(",").replace(/\^/g, ""),
      count: pkg.count
    }))).onConflictDoUpdate({
      target: [tables.lists.ghId, tables.lists.packageId],
      set: {
        versions: sql`excluded.versions`,
        count: sql`excluded.count`
      }
    }).returning().all();
  }
  else {
    const delete_q = `delete from "lists" where ("lists"."gh_id" = ${ghId} and "lists"."package_id" not in (${foundPackages.join(",")}))`;
    event.context.cloudflare.env.DB.prepare(delete_q).run();
    const values = list.map(pkg => `(${ghId}, ${pkg.id}, '${pkg.versions.join(",").replace(/\^/g, "")}', ${pkg.count})`);
    const insert_q = `insert into "lists" ("id", "gh_id", "package_id", "versions", "count") values ${values.join(",")} on conflict ("lists"."gh_id", "lists"."package_id") do update set "versions" = excluded.versions, "count" = excluded.count`;
    event.context.cloudflare.env.DB.prepare(insert_q).run();
  }

  await DB.update(tables.users).set({
    listUpdated: today
  }).where(eq(tables.users.ghId, ghId)).run();

  const userPackages = await DB.select({
    id: tables.packages.id,
    name: tables.packages.name,
    added: tables.packages.added,
    lastFetch: tables.packages.lastFetch,
    versions: tables.lists.versions,
    count: tables.lists.count
  }).from(tables.lists).innerJoin(tables.packages, eq(tables.lists.packageId, tables.packages.id)).where(eq(tables.lists.ghId, ghId)).orderBy(desc(tables.lists.count)).all();
  return { packages: userPackages };
});
