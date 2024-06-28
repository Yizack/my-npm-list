export default oauth.githubEventHandler({
  config: {
    scope: ["read:user"]
  },
  async onSuccess (event, { user: ghUser, tokens }) {
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
        access_token: tokens.access_token
      }
    });

    return sendRedirect(event, "/");
  },
  onError (event, error) {
    console.warn("GitHub OAuth error:", error);
    return sendRedirect(event, "/");
  }
});
