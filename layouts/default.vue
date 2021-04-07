<template>
  <v-app dark>
    <v-app-bar dark :hide-on-scroll="isMobile" app>
      <v-toolbar-title class="mr-3">
        <v-img max-height="50px" max-width="200px" contain src="/logo.svg" />
      </v-toolbar-title>

      <v-toolbar-items :class="[isMobile ? 'd-none' : '']">
        <v-btn
          v-for="route in routes"
          :key="route.name"
          :to="route.path"
          class="transparent"
          exact
          elevation="0"
          nuxt
          >{{ route.name }}</v-btn
        >
      </v-toolbar-items>
      <v-spacer />

      <v-toolbar-items>
        <v-menu close-on-click close-on-content-click bottom nudge-bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title>Cart</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Log in</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Sign up</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>

    <nuxt></nuxt>
    <v-footer class="py-10">
      <p>
        All rights reserved. Gadget Era @ 2021
      </p>
    </v-footer>
    <client-only>
      <v-bottom-navigation v-if="isMobile" app height="48px">
        <v-tabs v-model="tab" class="nav-tab" color="primary" grow>
          <v-tab v-for="route in bottomNav" :key="route.path" :to="route.path">
            <v-icon>{{ route.icon }}</v-icon>
          </v-tab>
        </v-tabs>
      </v-bottom-navigation>
    </client-only>
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
  data() {
    return {
      tab: 0,

      routes: [
        {
          name: "Home",
          path: "/"
        },
        {
          name: "Products",
          path: "/products"
        }
      ],
      bottomNav: [
        { name: "Home", path: "/", icon: "mdi-home" },
        { name: "Shop", path: "/products", icon: "mdi-store" },
        { name: "Cart", path: "/cart", icon: "mdi-cart" },
        { name: "Contact", path: "/profile", icon: "mdi-account-circle" }
      ]
    };
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    }
  },
  methods: {
    searchText() {
      this.$router.push("/products?q=" + this.search);
    },
    searchTextOnEnterKeypress(e) {
      e.target?.blur();
      this.$router.push("/products?q=" + this.search);
    }
  }
};
</script>
<style lang="scss">
@media only screen and (max-width: 379px) {
  .nav-tab {
    .v-slide-group__prev,
    .v-slide-group__next {
      display: none !important;
    }
  }
}
</style>
