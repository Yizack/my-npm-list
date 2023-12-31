export default eventHandler(async (event) => {
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

  const ghUser = await $fetch("https://api.github.com/user", {
    headers: {
      "User-Agent": `Github-OAuth-${config.github.clientId}`,
      Authorization: `Bearer ${response.access_token}`
    }
  }).catch(() => ({}));

  const ghUserName = ghUser.name ? ghUser.name : ghUser.login;
  const user = await useDb().insert(tables.users).values({
    ghId: ghUser.id,
    ghUser: ghUser.login,
    name: ghUserName,
    bio: ghUser.bio,
    joined: new Date().getTime()
  }).onConflictDoUpdate({
    target: tables.users.ghId,
    set: {
      ghUser: ghUser.login,
      name: ghUserName
    }
  }).returning().get();

  await setUserSession(event, {
    user,
    ghTokens: {
      access_token: response.access_token
    }
  });

  return sendRedirect(event, "/");
});
