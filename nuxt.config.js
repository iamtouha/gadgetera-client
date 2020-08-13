import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'universal',
  target: 'static',
  head: {
    titleTemplate: '%s | ' + 'Gadget Era',
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: [],
  plugins: [],
  components: true,
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify'],
  modules: [
    //
    '@nuxtjs/axios',
    '@nuxtjs/apollo',
  ],
  apollo: {
    cookieAttributes: {
      expires: 7,
    },
    defaultOptions: {
      $query: {
        loadingKey: 'loading',
        fetchPolicy: 'cache-and-network',
      },
    },
    errorHandler: '~/plugins/apollo-error-handler.js',
    clientConfigs: {
      default: {
        // required
        httpEndpoint: process.env.GQL_API || 'http://localhost:1337/graphql',
      },
    },
  },
  axios: {},
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: '#CBAD6D',
          accent: colors.grey.darken3,
          secondary: '#343434',
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  build: {
    extractCSS: true,
  },
}
