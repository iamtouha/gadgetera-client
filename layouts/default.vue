<template>
  <v-app>
    <v-app-bar elevate-on-scroll color="secondary" class="main-app-bar" app>
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />
      <v-toolbar-title class=" mr-auto ml-0">
        Gadget
        <span class="font-weight-bold">
          Era
        </span>
      </v-toolbar-title>
      <v-toolbar-items class="d-none d-md-block ml-3">
        <v-btn to="/" exact nuxt text>
          Home
        </v-btn>
        <v-btn to="/products" exact nuxt text>
          shop
        </v-btn>
        <v-btn to="/categories" exact nuxt text>
          Categories
        </v-btn>
        <v-btn to="/brands" exact nuxt text>
          Brands
        </v-btn>
        <v-btn to="/contact" exact nuxt text>
          Contact us
        </v-btn>
      </v-toolbar-items>
      <v-spacer />

      <v-toolbar-items>
        <v-btn
          v-if="isLoggedIn"
          text
          class="text-none d-none d-md-inline-flex"
          to="/account"
          nuxt
          exact
        >
          {{ user.name }}
        </v-btn>
        <v-btn
          v-else
          class="d-none d-md-inline-flex"
          to="/signup"
          nuxt
          text
          exact
        >
          Sign Up
          <v-icon right>
            mdi-login
          </v-icon>
        </v-btn>

        <v-btn text icon class="d-sm-none" @click="cartSheet = true">
          <v-icon>mdi-cart</v-icon>
          <v-chip style="padding:5px;" x-small>
            {{ cartItems.length }}
          </v-chip>
        </v-btn>
        <v-menu
          v-model="cartMenu"
          :close-on-content-click="false"
          max-width="400px"
          min-width="400px"
          offset-y
        >
          <template #activator="{ on, attrs }">
            <v-btn class="d-none d-sm-block" v-bind="attrs" text icon v-on="on">
              <v-icon>mdi-cart</v-icon>
              <v-chip style="padding:5px;" x-small>
                {{ cartItems.length }}
              </v-chip>
            </v-btn>
          </template>
          <cart @close="cartMenu = false" />
        </v-menu>
      </v-toolbar-items>
    </v-app-bar>
    <client-only>
      <v-navigation-drawer
        v-model="drawer"
        width="250px"
        class="d-md-none"
        :app="isMobile"
      >
        <nav-drawer-content />
      </v-navigation-drawer>
    </client-only>

    <v-main class="secondary mt-2">
      <Nuxt />
      <v-bottom-sheet v-model="cartSheet">
        <v-card>
          <v-card-title>
            Cart
          </v-card-title>
          <cart closebtn @close="cartSheet = false" />
        </v-card>
      </v-bottom-sheet>
    </v-main>
    <v-snackbar v-model="snackbar">
      {{ alertMessage }}
      <template #action="{ attrs }">
        <v-btn
          color="red accent-3"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-footer>
      <!--  -->
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "DefaultLayout",
  data: () => ({
    //
    cartSheet: false,
    cartMenu: false,
    drawer: false
  }),
  computed: {
    ...mapGetters("cart", ["cartItems"]),
    ...mapGetters(["alertMessage", "isLoggedIn", "user"]),
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    snackbar: {
      get() {
        return this.$store.getters.snackbar;
      },
      set(val) {
        // eslint-disable-next-line curly
        if (!val) this.$store.commit("HIDE_ALERT");
      }
    }
  },
  watch: {
    cartItems: {
      deep: true,
      handler() {
        this.$store.commit("cart/SAVE_CART");
      }
    }
  }
};
</script>
<style lang="scss">
.v-application {
  font-feature-settings: "lnum" 1 !important;
}
</style>
