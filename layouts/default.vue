<template>
  <v-app>
    <v-app-bar dark color="primary" app>
      <v-toolbar-title class="mr-3">Gadget Era</v-toolbar-title>

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
      <template v-if="isMobile && $route.name !== 'products'" v-slot:extension>
        <v-text-field
          v-model="search"
          dense
          flat
          solo
          light
          hide-details
          label="search"
        ></v-text-field>
        <v-btn text class="accent">search</v-btn>
      </template>
      <client-only v-if="!isMobile && $route.name !== 'products'">
        <v-text-field
          v-model="search"
          style="max-width: 400px"
          light
          flat
          dense
          solo
          hide-details
          label="search"
        ></v-text-field>
        <v-btn
          class="black--text accent"
          :style="{
            'max-width': isMobile ? '40px' : '',
            'min-width': isMobile ? '40px' : '',
          }"
          :to="'/search/' + search"
          elevation="0"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </client-only>
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
    <client-only>
      <v-bottom-navigation v-if="isMobile" app height="48px">
        <v-tabs v-model="tab" color="primary" grow>
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
      search: "",

      routes: [
        {
          name: "Home",
          path: "/",
        },
        {
          name: "Products",
          path: "/products",
        },
      ],
      bottomNav: [
        { name: "Home", path: "/", icon: "mdi-home" },
        { name: "Shop", path: "/products", icon: "mdi-store" },
        { name: "Cart", path: "/cart", icon: "mdi-cart" },
        { name: "Contact", path: "/contact", icon: "mdi-headset" },
      ],
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
  },
}
</script>
