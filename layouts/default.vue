<template>
  <v-app>
    <v-main class="secondary mt-2">
      <Nuxt />
    </v-main>
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
