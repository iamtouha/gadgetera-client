import colors from "vuetify/es5/util/colors";
const axios = require("axios");

// const devUrl="http://localhost:1338"
const devUrl = "https://server.gadgeterabd.com";

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
  css: ["~/assets/main.css"],

  plugins: ["~/plugins/axios"],

  components: true,

  buildModules: ["@nuxtjs/vuetify"],

  modules: [
    "nuxt-client-init-module",
    "@nuxtjs/markdownit",
    "@nuxtjs/axios",
    "@nuxtjs/strapi",
    "@nuxtjs/sitemap"
  ],

  sitemap: {
    hostname: process.env.BASE_URL || "https://gadgeterabd.com",
    gzip: true,
    exclude: ["/cart", "/checkout", "/user", "/user/reset-password"],
    routes: async () => {
      const baseUrl = process.env.BASE_URL || devUrl;
      const { data: products } = await axios.get(
        baseUrl + "/products?_sort:updatedAt:DESC"
      );
      const productPages = products.map(prod => ({
        url: "/products/" + prod.slug,
        changefreq: "weekly",
        lastmod: prod.updatedAt,
        priority: 0.8
      }));
      return [
        {
          url: "/",
          changefreq: "weekly",
          priority: 1
        },
        {
          url: "/products",
          changefreq: "weekly",
          lastmod: products[0].updatedAt,
          priority: 1
        },
        ...productPages
      ];
    }

    // routes: [
    //   '/page/1',
    //   '/page/2',
    //   {
    //     url: '/page/3',
    //     changefreq: 'daily',
    //     priority: 1,
    //     lastmod: '2017-06-30T13:30:00.000Z'
    //   }
    // ]
  },
  strapi: {
    url: process.env.BASE_URL || devUrl
  },

  axios: {
    baseUrl: process.env.BASE_URL || devUrl
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
