import colors from "vuetify/es5/util/colors";

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
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  css: [],

  image: {
    cloudinary: {
      baseURL: "https://res.cloudinary.com/nuxt/image/upload/"
    }
  },

  plugins: ["~/plugins/axios"],

  components: true,

  buildModules: ["@nuxtjs/vuetify"],

  modules: [
    "nuxt-client-init-module",
    "@nuxtjs/markdownit",
    "@nuxtjs/axios",
    "@nuxtjs/strapi"
  ],
  strapi: {
    url: process.env.BASE_URL || "http://localhost:1338"
  },

  axios: {
    baseUrl: process.env.BASE_URL || "http://localhost:1338"
  },

  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    treeShake: true,
    options: {
      customProperties: true
    },
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: "#fe4a21",
          accent: "#fe4a21",
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.yellow.accent2,
          success: colors.green.accent3
        },
        light: {
          primary: "#fe4a21",
          accent: "#fe4a21",
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.red.base,
          success: colors.green.accent3
        }
      }
    }
  },
  markdownit: {
    runtime: true,
    preset: "default",
    linkify: true,
    breaks: true
  },

  build: {
    extractCSS: true
  }
};
