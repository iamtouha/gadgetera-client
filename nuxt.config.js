/* eslint-disable nuxt/no-cjs-in-config */
const axios = require("axios");
export default {
  target: "static",

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
    "@nuxtjs/sitemap"
  ],

  sitemap: {
    hostname: "https://gadgeterabd.com",
    trailingSlash: true,
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
          error: "#FF8A80",
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

async function generateRoutes() {
  const baseUrl = process.env.BASE_URL || "http://localhost:1337";
  const { data: products } = await axios.get(
    baseUrl + "/products?_sort=updatedAt:DESC"
  );
  const { data: categories } = await axios.get(
    baseUrl + "/categories?_sort=updatedAt:DESC"
  );
  const { data: brands } = await axios.get(
    baseUrl + "/brands?_sort=updatedAt:DESC"
  );
  const { data: subcats } = await axios.get(
    baseUrl + "/subcategories?_sort=updatedAt:DESC"
  );
  const productPages = products.map(prod => ({
    url: "/products/" + prod.slug,
    changefreq: "weekly",
    lastmod: prod.updatedAt,
    priority: 0.8,
    img: prod.images.map(item => ({
      url: item.url,
      caption: item.caption || prod.name,
      title: prod.name
    }))
  }));
  const categoryPages = categories.map(cat => ({
    url: "/categories/" + cat.key,
    changefreq: "weekly",
    lastmod: cat.updatedAt,
    priority: 0.8,
    img: [
      {
        url: cat.cover.url,
        caption: cat.cover.caption || cat.name,
        title: cat.name
      }
    ]
  }));
  const brandPages = brands.map(item => ({
    url: "/brands/" + item.key,
    changefreq: "weekly",
    lastmod: item.updatedAt,
    priority: 0.8,
    img: [
      {
        url: item.logo.url,
        caption: item.logo.caption || item.name,
        title: item.name
      }
    ]
  }));
  const subcatPages = subcats.map(item => ({
    url: "/subcategories/" + item.key,
    changefreq: "weekly",
    lastmod: item.updatedAt,
    priority: 0.8,
    img: [
      {
        url: item.cover.url,
        caption: item.cover.caption || item.name,
        title: item.name
      }
    ]
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
    {
      url: "/categories",
      changefreq: "weekly",
      lastmod: categories[0].updatedAt,
      priority: 1
    },
    {
      url: "/brands",
      changefreq: "weekly",
      lastmod: brands[0].updatedAt,
      priority: 1
    },
    ...productPages,
    ...categoryPages,
    ...brandPages,
    ...subcatPages
  ];
}
