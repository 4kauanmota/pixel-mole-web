// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Pixel Mole",
    },
  },

  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },

  css: ["@/assets/css/main.css"],
  modules: [
    "@nuxtjs/tailwindcss",
    "@formkit/auto-animate/nuxt",
    "@nuxtjs/i18n",
  ],

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },

  i18n: {
    defaultLocale: "en",
    differentDomains: true,
    detectBrowserLanguage: false,
    strategy: "no_prefix",
    locales: [
      {
        code: "pt",
        name: "Português",
        file: "pt.json",
        domain: process.env.DOMAIN_PT,
        strategy: "no_prefix",
      },
      {
        code: "en",
        name: "English",
        file: "en.json",
        domain: process.env.DOMAIN_EN,
      },
    ],
  },
});
