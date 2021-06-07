<template>
  <v-app>
    <v-app-bar elevate-on-scroll color="primary" dark class="main-app-bar" app>
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />
      <v-toolbar-title class=" mr-auto ml-0">
        Gadget
        <span class="font-weight-bold">
          Era
        </span>
      </v-toolbar-title>
      <v-toolbar-items class="d-none d-md-block ml-3">
        <v-btn
          v-for="route in navRoutes"
          :key="route.name"
          :to="route.path"
          class="font-weight-bold"
          exact
          nuxt
          text
        >
          {{ route.name }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer />
      <client-only>
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
          <v-btn
            text
            icon
            class="d-sm-none mobile-cart-btn"
            @click="cartSheet = true"
          >
            <v-icon>
              mdi-cart
            </v-icon>
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
              <v-btn
                class="d-none d-sm-block cart-btn"
                v-bind="attrs"
                text
                icon
                v-on="on"
              >
                <v-icon>mdi-cart</v-icon>
                <v-chip style="padding:5px;" x-small>
                  {{ cartItems.length }}
                </v-chip>
              </v-btn>
            </template>
            <cart @close="cartMenu = false" />
          </v-menu>
        </v-toolbar-items>
      </client-only>
    </v-app-bar>
    <client-only>
      <v-navigation-drawer
        v-model="drawer"
        color="primary"
        dark
        width="220px"
        class="d-md-none"
        :app="isMobile"
      >
        <nav-drawer-content />
      </v-navigation-drawer>
    </client-only>

    <v-main class="secondary">
      <Nuxt />
      <v-bottom-sheet v-model="cartSheet">
        <v-card>
          <v-card-title>
            Cart
          </v-card-title>
          <client-only>
            <cart closebtn @close="cartSheet = false" />
          </client-only>
        </v-card>
      </v-bottom-sheet>
    </v-main>
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
    <v-footer class="py-3" dark color="primary">
      <v-row>
        <v-col cols="12" sm="6">
          <v-list-item style="max-width:220px;" dense @click="openDialer">
            <v-icon left>
              mdi-phone
            </v-icon>
            {{ contact.phone }}
          </v-list-item>
          <v-list-item
            style="max-width:250px;"
            dense
            :href="'mailto:' + contact.email"
          >
            <v-icon left>
              mdi-email-outline
            </v-icon>
            {{ contact.email }}
          </v-list-item>
        </v-col>
        <v-col cols="12" sm="6">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-subtitle class="text-subtitle-1 text-sm-right">
                Social Networks
              </v-list-item-subtitle>
              <v-list-item-title class="text-sm-right">
                <v-btn
                  v-for="network in networks"
                  :key="network.name"
                  icon
                  text
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
        <v-col cols="12" sm="6">
          <v-list-item dense nuxt to="/terms-and-conditions">
            Terms and conditions
          </v-list-item>
          <v-list-item dense nuxt to="/privacy-policy">
            Privacy policy
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
    navRoutes: [
      { name: "Home", path: "/" },
      { name: "Store", path: "/products" },
      { name: "Categories", path: "/categories" },
      { name: "brands", path: "/brands" },
      { name: "Contact us", path: "/contact" }
    ],
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
      phone: "+880-19362-99699",
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
  },
  methods: {
    openDialer() {
      window.open("tel:" + this.contact.phone);
    }
  }
};
</script>
<style lang="scss">
.v-application {
  font-feature-settings: "lnum" 1 !important;
}
.loadingbar-wrapper {
  max-width: 1920px;
  height: 5px;
  margin: 0 auto;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
