module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    "cypress/globals": true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  plugins: ["cypress"],
  extends: ["@nuxtjs", "plugin:nuxt/recommended", "plugin:cypress/recommended"],
  // add your custom rules here
  rules: {
    semi: [1, "always"],
    quotes: ["error", "double"],
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "always",
          component: "always"
        },
        svg: "always",
        math: "always"
      }
    ],
    "vue/max-attributes-per-line": [
      2,
      {
        singleline: 20,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],

    "space-before-function-paren": 0,
    "arrow-parens": [2, "as-needed", { requireForBlockBody: false }]
  }
};
