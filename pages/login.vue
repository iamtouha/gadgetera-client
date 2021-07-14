<template>
  <v-container class="fill-height">
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="5">
        <v-card class="my-10" outlined>
          <v-card-title>
            Log In
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="user.email"
              type="email"
              ref="emailField"
              flat
              label="Email"
              placeholder="Email"
              single-line
            />
            <v-text-field
              v-model="user.password"
              flat
              :type="viewPass ? 'text' : 'password'"
              :append-icon="viewPass ? 'mdi-eye' : 'mdi-eye-off'"
              label="Password"
              placeholder="Password"
              single-line
              @click:append="viewPass = !viewPass"
            />
          </v-card-text>

          <v-card-actions
            class="d-flex flex-column-reverse flex-sm-row justify-sm-space-between align-end"
          >
            <v-btn
              nuxt
              text
              color="primary"
              class="text-capitalize"
              @click="forgotPassword"
            >
              forgot password?
            </v-btn>
            <span class="mr-0 ml-auto">
              <v-btn nuxt to="/signup" text>
                sign up
              </v-btn>
              <v-btn
                class="font-weight-medium px-4"
                elevation="0"
                :loading="loading"
                color="accent"
                @click="login"
              >
                log in
              </v-btn>
            </span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable no-useless-escape */
import { mapMutations } from "vuex";
export default {
  name: "Login",
  middleware: "guest",
  data: () => ({
    viewPass: false,
    loading: false,
    user: {
      email: "",
      password: ""
    }
  }),
  head() {
    return {
      title: "Log In"
    };
  },
  methods: {
    ...mapMutations(["SHOW_ALERT"]),
    async login() {
      try {
        this.loading = true;
        if (!this.user.email || !this.user.password) {
          this.SHOW_ALERT("Email and password required.");
        }
        await this.$store.dispatch("logIn", this.user);
        this.$router.push("/");
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
        return error;
      } finally {
        this.loading = false;
      }
    },
    async forgotPassword() {
      const email = this.user.email;
      try {
        if (!email) {
          this.SHOW_ALERT("First, enter your email.");
          return this.$refs.emailField?.focus();
        }
        const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegExp.test(email)) {
          this.SHOW_ALERT("Enter a valid email.");
          return this.$refs.emailField?.focus();
        }
        await this.$repositories.user.forgotPassword(email);
        this.SHOW_ALERT("Check your email for password reset link.");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style></style>
