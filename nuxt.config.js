export default {
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "",
      htmlAttrs: {
        lang: "en"
      },
      bodyAttrs: {
        "data-bs-theme": "dark"
      },
      meta: [
        { name: "robots", content: "index, follow" }
      ]
    }
  },
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "~/assets/css/main.css",
    "~/assets/css/theme-dark.css",
    "~/assets/css/navbar.css"
  ],
  modules: [
    "nuxt-icon",
    "nuxt-twemoji"
  ],
  runtimeConfig: {
    session: {
      name: "nuxt-session",
      password: ""
    },
    github: {
      clientId: "",
      clientSecret: ""
    }
  }
};
