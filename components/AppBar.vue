<template>
  <v-app-bar
    app
    :elevate-on-scroll="!isMobile"
    :hide-on-scroll="isMobile"
    :flat="isMobile"
    :color="$vuetify.theme.dark ? '' : 'secondary'"
    class="app-bar"
  >
    <template #extension>
      <navigation-tabs />
    </template>
    <v-toolbar-title style="min-width:144px;">
      <v-img
        :src="$vuetify.theme.dark ? '/icon-dark.svg' : '/icon.svg'"
        width="50px"
        aspect-ratio="1"
        class="pa-0 ma-0"
        contain
        @click="$router.push('/')"
      />
    </v-toolbar-title>
    <v-spacer />
    <navigation-tabs height="56px" centered class="d-none d-md-block" />

    <v-spacer />
    <div style="min-width:144px;" class="d-flex">
      <v-btn
        v-show="$route.name === 'products'"
        text
        icon
        elevation="0"
        @click="focusOnSearch"
      >
        <v-icon>
          mdi-magnify
        </v-icon>
      </v-btn>
      <search-menu />
      <v-btn
        text
        icon
        class="text-none d-md-inline-flex mx-auto"
        to="/account"
        nuxt
        exact
      >
        <span />
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
              class="cart-activator-notifier accent"
            />
            <v-icon>mdi-cart-outline</v-icon>
          </v-btn>
        </template>
        <cart @close="cartMenu = false" />
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AppBar",

  data: () => ({
    cartMenu: false
  }),
  computed: {
    ...mapGetters("cart", ["cartItems"]),
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
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
  .app-bar {
    height: 64px !important;
    .v-toolbar__extension {
      display: none;
    }
  }
}
</style>
