export default {
  target: "static",
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

  css: [],

  plugins: ["~/plugins/axios"],
  loading: false,
  components: true,

  buildModules: ["@nuxtjs/eslint-module", "@nuxtjs/vuetify"],

  modules: [
    "nuxt-client-init-module",
    "@nuxtjs/axios",
    "nuxt-webfontloader",
    "cookie-universal-nuxt",
    "@nuxtjs/markdownit"
  ],

  markdownit: {
    runtime: true
  },

  axios: {
    baseUrl: process.env.BASE_URL || "http://localhost:1337"
  },
  webfontloader: {
    google: {
      families: ["Raleway:200,300,400,500,600"]
    }
  },

  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        light: {
          primary: "#212121",
          accent: "#424242",
          secondary: "#FAFAFA",
          info: "#26A69A",
          warning: "#FFC107",
          error: "#DD2C00",
          success: "#00E676"
        }
      }
    }
  },

  build: {
    extractCSS: {
      ignoreOrder: true
    },
    babel: {
      plugins: [["@babel/plugin-proposal-private-methods", { loose: true }]]
    }
  }
};
