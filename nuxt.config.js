import colors from "vuetify/es5/util/colors"

const dev = process.env.NODE_ENV && process.env.NODE_ENV === "development"

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: "static",

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: "%s - Gadget Era",
    title: "Gadget Era",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    "@nuxtjs/eslint-module",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "@nuxtjs/apollo",
  ],
  apollo: {
    cookieAttributes: {
      expires: 7,
    },
    defaultOptions: {
      $query: {
        loadingKey: "loading",
        fetchPolicy: "cache-and-network",
      },
    },
    errorHandler: "~/plugins/apollo-error-handler.js",
    clientConfigs: {
      default: {
        // required
        httpEndpoint: dev
          ? "http://localhost:1337/graphql"
          : "https://gadgetera.herokuapp.com/graphql",
      },
    },
  },
  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: "#325D79",
          accent: {
            base: colors.orange.accent4,
            lighten3: colors.orange.lighten3,
            lighten4: colors.orange.lighten4,
            darken4: colors.orange.darken4,
          },
          secondary: "#f2f2f2",
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
}
