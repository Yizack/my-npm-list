export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
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
    "~/assets/css/transitions.css",
    "~/assets/css/theme-dark.css",
    "~/assets/css/navbar.css",
    "~/assets/css/buttons.css"
  ],
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "nuxt-twemoji",
    "nuxt-auth-utils"
  ],
  icon: {
    mode: "svg",
    clientBundle: { scan: true, sizeLimitKb: 2048 }
  },
  eslint: {
    config: {
      autoInit: false,
      stylistic: true
    }
  },
  runtimeConfig: {
    session: {
      name: "nuxt-session",
      password: ""
    },
    oauth: {
      github: {
        clientId: "",
        clientSecret: ""
      }
    }
  },
  features: {
    inlineStyles: false
  },
  experimental: {
    typedPages: true
  }
});
