<template>
  <v-app>
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
          <client-only>
            <cart closebtn @close="cartSheet = false" />
          </client-only>
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
