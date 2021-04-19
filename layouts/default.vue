<template>
  <v-app dark>
    <v-app-bar elevation="0" dark app>
      <v-toolbar-title class="mr-3 pt-2">
        <img style="height:auto; width:180px;" src="/logo.svg" />
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items class="main-toolbar-items">
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

      <v-toolbar-items>
        <v-btn
          elevation="0"
          icon
          text
          @click="$vuetify.theme.dark = !$vuetify.theme.dark"
        >
          <v-icon v-if="$vuetify.theme.dark">mdi-brightness-4</v-icon>
          <v-icon v-else>mdi-white-balance-sunny</v-icon>
        </v-btn>
        <v-btn
          to="/cart"
          nuxt
          elevation="0"
          class="cart-icon"
          color="accent"
          text
        >
          <v-chip pill small class="pa-2">{{ cartLength }}</v-chip>
          <v-icon>mdi-cart</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-main style="margin-bottom:100px;">
      <nuxt></nuxt>
    </v-main>

    <v-snackbar v-model="snackbar">
      {{ message }}
      <template #action="{ attrs }">
        <v-btn color="accent" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-footer app absolute min-height="170px">
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-list class="pb-10 pb-sm-2" dense color="transparent">
            <v-list-item to="/contact-us">
              contact us
            </v-list-item>
            <v-list-item to="/privacy-policy">
              privacy policy
            </v-list-item>
            <v-list-item to="/terms-and-conditions">
              terms and conditions
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-footer>
    <v-bottom-navigation class="bottom-nav" app fixed height="48px">
      <v-tabs v-model="tab" class="nav-tab" color="primary" grow>
        <v-tab v-for="route in bottomNav" :key="route.path" :to="route.path">
          <v-icon>{{ route.icon }}</v-icon>
        </v-tab>
      </v-tabs>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
  data() {
    return {
      tab: 0,
      routes: [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "Dashboard", path: "/user/" }
      ],
      bottomNav: [
        { name: "Home", path: "/", icon: "mdi-home" },
        { name: "Shop", path: "/products", icon: "mdi-store" },
        { name: "Cart", path: "/cart", icon: "mdi-cart" },
        { name: "Dashboard", path: "/user", icon: "mdi-account-circle" }
      ]
    };
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    cartLength() {
      return this.$store.getters["cart/cart"].length;
    },
    snackbar: {
      get() {
        return this.$store.getters["snackbar"];
      },
      set(val) {
        if (val) {
          return this.$store.commit("showAlert", "no message");
        }
        this.$store.commit("hideAlert");
      }
    },
    message() {
      return this.$store.getters["message"];
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
@media only screen and (min-width: 960px) {
  .bottom-nav {
    display: none !important;
  }
}
@media only screen and (max-width: 959px) {
  .main-toolbar-items {
    display: none !important;
  }
  .cart-icon {
    display: none;
  }
}
.search-pan {
  div.textbox-wrapper {
    display: flex;
  }
}

.theme--light {
  .v-card {
    background: #f5f5f5 !important;
  }
}
</style>
