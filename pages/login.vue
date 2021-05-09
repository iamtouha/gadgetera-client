<template>
  <v-container class="fill-height">
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card outlined>
          <v-card-title>
            Log In
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="user.email"
              label="Email"
              placeholder="Email"
              single-line
            />
            <v-text-field
              v-model="user.password"
              :type="viewPass ? 'text' : 'password'"
              :append-icon="viewPass ? 'mdi-eye' : 'mdi-eye-off'"
              label="Password"
              placeholder="Password"
              single-line
              @click:append="viewPass = !viewPass"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn nuxt to="/signup" text>
              sign up
            </v-btn>
            <v-btn class="primary" :loading="loading" text @click="login">
              log in
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
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
  methods: {
    login() {
      if (!this.user.email || !this.user.password) {
        return this.$store.commit("SHOW_ALERT", "Email and password required.");
      }
      this.loading = true;
      this.$store
        .dispatch("logIn", this.user)
        .then(() => this.$nuxt.$router.push("/"))
        .catch(err => err)
        .finally(() => (this.loading = false));
    }
  }
};
</script>

<style></style>
