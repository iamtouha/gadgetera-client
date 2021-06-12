/* eslint-disable nuxt/no-cjs-in-config */
const generateRoutes = require("./sitemapRoutesGenerator");

export default {
  target: "server",

  generate: { fallback: "404.html" },

  head: {
    titleTemplate: "%s | Gadget Era",
    title: "Gadget Era",
    htmlAttrs: {
      lang: "en"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      {
        hid: "og:image",
        name: "og:image",
        content: "/home-banner-placeholder.jpg"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  css: ["~/assets/main.css"],

  plugins: ["~/plugins/axios", "~/plugins/repositories.js"],
  loading: false,
  components: true,

  buildModules: ["@nuxtjs/eslint-module", "@nuxtjs/vuetify"],

  modules: [
    "nuxt-client-init-module",
    "@nuxtjs/axios",
    "nuxt-webfontloader",
    "cookie-universal-nuxt",
    "@nuxtjs/sitemap"
  ],

  sitemap: {
    hostname: "https://gadgeterabd.com",
    gzip: true,
    exclude: [
      "/checkout",
      "/account",
      "/account/**",
      "/orders",
      "/orders/**",
      "/thank-you"
    ],
    routes: generateRoutes
  },

  axios: {
    baseUrl: process.env.BASE_URL || "http://localhost:1337",
    retry: true
  },
  webfontloader: {
    google: {
      families: ["Raleway:200,300,400,500,600,700"]
    }
  },

  vuetify: {
    customProperties: true,
    customVariables: ["~/assets/variables.scss"],
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        light: {
          primary: "#6b818c",
          secondary: "#eee5e9",
          accent: "#fe5f55",
          info: "#fdfce2",
          warning: "#FFC107",
          error: "#FF8A80",
          success: "#00E676"
        }
      }
    }
  },

  build: {
    babel: {
      plugins: [["@babel/plugin-proposal-private-methods", { loose: true }]]
    }
  }
};
