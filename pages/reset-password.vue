<template>
  <v-container class="fill-height">
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="5">
        <v-card outlined class="mt-2 mb-6">
          <v-card-title>
            Reset Password
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="user.password"
              flat
              :type="viewPass ? 'text' : 'password'"
              label="New Password"
              placeholder="New Password"
              single-line
              :append-icon="viewPass ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="viewPass = !viewPass"
            />
            <v-text-field
              v-model="user.repeatPassword"
              flat
              :type="viewPass ? 'text' : 'password'"
              label="Enter Again"
              placeholder="Enter Again"
              single-line
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn nuxt to="/login" text>
              log in
            </v-btn>
            <v-btn
              class="font-weight-medium px-4"
              elevation="0"
              :loading="loading"
              color="accent"
              @click="savePassword"
            >
              Save Password
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "ForgotPassword",
  middleware: "hasCode",
  data: () => ({
    loading: false,
    user: {
      password: "",
      repeatPassword: ""
    },
    viewPass: false
  }),
  head() {
    return {
      title: "Reset Password"
    };
  },
  methods: {
    ...mapMutations(["SHOW_ALERT"]),
    async savePassword() {
      try {
        await this.$repositories.user.resetPassword({
          code: this.$route.query.code,
          password: this.user.password,
          passwordConfirmation: this.user.repeatPassword
        });
        this.SHOW_ALERT("Your password is reset. Please Log in");
        this.$router.push("/login");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
