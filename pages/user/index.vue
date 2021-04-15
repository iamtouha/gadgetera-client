<template>
  <v-container class="mt-4">
    <v-dialog v-model="dialog" max-width="350px">
      <v-card elevation="0">
        <v-card-text class="body-1 pt-3">
          A password reset link will be sent to your email. Please follow that
          link to change the password.
        </v-card-text>
        <v-card-actions>
          <v-spacer> </v-spacer>
          <v-btn text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn
            elevation="0"
            color="accent"
            class="black--text"
            :loading="resetting"
            @click="resetPass"
          >
            continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12" md="8" order="2" order-md="1">
        <v-card elevation="0">
          <v-card-title>Orders</v-card-title>
        </v-card>

        <v-card elevation="0" class="my-2">
          <v-card-title>Orders</v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" order="1" order-md="2">
        <client-only>
          <template #placeholder>
            <v-skeleton-loader
              type="card-header,article,actions"
            ></v-skeleton-loader>
          </template>
          <v-card elevation="0">
            <v-card-title>
              <h1 class="headline">{{ user && user.name }}</h1>
            </v-card-title>
            <v-card-subtitle>
              <h2 class="subtitle-1">{{ user && user.email }}</h2>
            </v-card-subtitle>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="accent" @click="dialog = true">
                Reset password
              </v-btn>

              <v-btn
                elevation="0"
                color="accent"
                class="black--text"
                @click="signout"
              >
                logout
                <v-icon class="d-md-none d-lg-block" right>mdi-logout</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </client-only>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Dashboard",
  middleware: "authenticated",
  data() {
    return {
      resetting: false,
      dialog: false
      //
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  created() {},
  methods: {
    signout() {
      this.$store.commit("signOut", this.$nuxt);
    },
    async resetPass() {
      try {
        this.resetting = true;
        await this.$strapi.forgotPassword({
          email: this.user.email
        });
        this.resetting = false;
        this.dialog = false;
        this.$store.commit("showAlert", "Reset password link sent");
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style></style>
