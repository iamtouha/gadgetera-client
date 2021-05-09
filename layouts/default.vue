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
        <client-only>
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
        </client-only>
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
        <v-btn color="white" text icon v-bind="attrs" @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-footer class="py-3">
      <v-row>
        <v-col cols="12" sm="6">
          <v-list-item dense>
            <v-icon left>
              mdi-phone
            </v-icon>
            {{ contact.phone }}
          </v-list-item>
          <v-list-item dense>
            <v-icon left>
              mdi-email-outline
            </v-icon>
            {{ contact.email }}
          </v-list-item>
        </v-col>
        <v-col cols="12" sm="6">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-subtitle
                class="text-subtitle-1 primary--text text-sm-right"
              >
                Social Networks
              </v-list-item-subtitle>
              <v-list-item-title class="text-sm-right">
                <v-btn
                  v-for="network in networks"
                  :key="network.name"
                  icon
                  text
                  color="primary"
                  large
                  target="_blank"
                  :href="network.link"
                >
                  <v-icon>{{ network.icon }}</v-icon>
                </v-btn>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
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
    drawer: false,
    networks: [
      {
        name: "Facebook",
        icon: "mdi-facebook",
        link: "https://www.facebook.com/gadgetEraBangladesh"
      },
      {
        name: "Messenger",
        icon: "mdi-facebook-messenger",
        link: "https://m.me/gadgetEraBangladesh"
      },
      {
        name: "Instagram",
        icon: "mdi-instagram",
        link: "https://www.instagram.com/gadget.era/"
      }
    ],
    contact: {
      phone: "01936299699",
      email: "gadgeterabd@gmail.com"
    }
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
