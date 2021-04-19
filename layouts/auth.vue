<template>
  <v-app>
    <v-main class="auth-wrapper">
      <v-img class="auth-wrapper-img" src="/auth.jpg" lazy-src="/auth-lazy.jpg">
        <v-container class="fill-height">
          <v-row class="fill-height" justify="center" align="center">
            <v-col cols="12" sm="8" md="6">
              <router-view></router-view>
            </v-col>
          </v-row>
        </v-container>
      </v-img>
      <v-snackbar v-model="snackbar">
        {{ message }}
        <template #action="{ attrs }">
          <v-btn color="accent" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "AuthLayout",
  data() {
    return {
      //
    };
  },
  computed: {
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
  }
};
</script>

<style lang="scss">
.semi-transparent-dark {
  background: rgba($color: #000000, $alpha: 0.75) !important;
}
.semi-transparent-light {
  background: rgba($color: #ffffff, $alpha: 0.75) !important;
}
.auth-wrapper {
  height: 100vh;
}
.auth-wrapper-img {
  height: 100%;
}
</style>
