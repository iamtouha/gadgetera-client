<template>
  <v-app>
    <v-app-bar
      app
      :absolute="darkMode"
      :elevate-on-scroll="!isMobile"
      :flat="isMobile"
      color="secondary"
      class="showcase-app-bar"
    >
      <v-btn
        :to="prevRoute.path"
        nuxt
        exact
        class="font-weight-bold pl-0"
        text
        color="primary"
      >
        <v-icon class="mr-2">
          mdi-arrow-left
        </v-icon>
        {{ prevRoute.name }}
      </v-btn>
      <v-spacer />
      <navigation-tabs height="56px" centered class="d-none d-md-block" />
      <v-spacer />

      <search-menu />
      <v-btn
        text
        icon
        class="text-none d-md-inline-flex"
        to="/account"
        nuxt
        exact
      >
        <v-icon>mdi-account-circle-outline</v-icon>
      </v-btn>
      <v-menu
        v-model="cartMenu"
        offset-y
        :close-on-content-click="false"
        min-width="300px"
      >
        <template #activator="{ on, attrs }">
          <v-btn class="cart-activator" v-bind="attrs" text icon v-on="on">
            <span
              v-show="cartItems.length"
              class="accent cart-activator-notifier"
            />
            <v-icon>mdi-cart-outline</v-icon>
          </v-btn>
        </template>
        <cart @close="cartMenu = false" />
      </v-menu>
    </v-app-bar>
    <v-main class="secondary">
      <Nuxt />
      <v-snackbar v-model="snackbar">
        {{ alertMessage }}
        <template #action="{ attrs }">
          <v-btn
            color="accent"
            text
            icon
            v-bind="attrs"
            @click="snackbar = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
    <footer-section />
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "NoExtension",

  data: () => ({
    cartMenu: false
  }),
  computed: {
    ...mapGetters(["alertMessage", "isLoggedIn", "user"]),
    ...mapGetters("cart", ["cartItems"]),
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    darkMode() {
      const name = this.$route.name;
      return name !== "products-slug";
    },
    snackbar: {
      get() {
        return this.$store.getters.snackbar;
      },
      set(val) {
        // eslint-disable-next-line curly
        if (!val) this.$store.commit("HIDE_ALERT");
      }
    },
    prevRoute() {
      const route = { path: "", name: "" };
      switch (this.$route.name) {
        case "products-slug":
          route.path = "/products";
          route.name = "Products";
          break;
        default:
          route.path = "/";
          route.name = "Home";
          break;
      }
      return route;
    }
  },

  methods: {
    focusOnSearch() {
      this.$nuxt.$emit("search-field-focus");
    }
  }
};
</script>
<style lang="scss">
@import "~vuetify/src/styles/styles.sass";
@media #{map-get(
    $display-breakpoints,
    "md-and-up"
  )} {
}
</style>
