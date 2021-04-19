<template>
  <div style="display:contents;">
    <v-card dark class="semi-transparent-dark" elevation="0">
      <v-card-title>
        Log In
        <v-spacer></v-spacer>
        <v-btn text nuxt to="/"
          >Home
          <v-icon right>mdi-arrow-right</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="loginForm">
          <v-text-field
            v-model="user.identifier"
            :dense="isMobile"
            dark
            label="Email"
            filled
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :dense="isMobile"
            dark
            hide-details
            label="Password"
            type="password"
            filled
          ></v-text-field>
        </v-form>
        <v-btn class="mt-1" text nuxt to="/user/forgot-password"
          >forgot password?</v-btn
        >
      </v-card-text>
      <v-card-actions>
        <v-spacer> </v-spacer>
        <v-btn text dark large nuxt to="/user/signup">sign up</v-btn>
        <v-btn
          elevation="0"
          large
          :loading="loading"
          color="accent"
          class="black--text"
          @click="logIn"
          >log in</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "LogIn",
  layout: "auth",
  middleware: "guest",
  data() {
    return {
      loading: false,
      user: {
        identifier: "",
        password: ""
      }
    };
  },
  head: {
    title: "Login"
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    }
  },
  created() {},
  methods: {
    logIn() {
      this.loading = true;
      this.$axios
        .$post("/auth/local", this.user)
        .then(data => {
          const date = new Date();
          date.setMonth(date.getMonth() + 1);
          this.$nuxt.$cookies.set("jwt_token", data.jwt, {
            expires: date
          });
          this.$axios.setToken(data.jwt, "Bearer");
          this.$store.commit("setUser", data.user);
          this.$router.push("/user");
        })
        .catch(err => console.error(err.message))
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style></style>
