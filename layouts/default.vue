<template>
  <v-app>
    <app-bar />

    <v-main class="secondary default-main">
      <Nuxt />
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
    <footer-section />
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "DefaultLayout",

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
.loadingbar-wrapper {
  max-width: 1920px;
  height: 5px;
  margin: 0 auto;
}
.cursor-pointer {
  cursor: pointer;
}
#logo {
  object-fit: contain;
  object-position: center;
  width: 160px;
}
.responsive {
  position: relative;
  overflow: hidden;
  .offer-chip {
    position: absolute;
    z-index: 4;
    top: 5px;
    right: 5px;
  }
  .sizer {
    position: relative;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    padding-bottom: 100%;
  }
  .wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}
.search-input {
  .v-input__append-inner .v-icon {
    color: var(--v-accent);
  }
}

@import "~vuetify/src/styles/styles.sass";
@media #{map-get(
    $display-breakpoints,
    "md-and-up"
  )} {
  .default-main {
    padding-top: 60px !important;
  }
}
.default-main {
  min-height: 100vh;
}
</style>
