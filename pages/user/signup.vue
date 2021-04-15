<template>
  <div style="display:contents;">
    <v-card rounded class="semi-transparent-dark" elevation="0">
      <v-card-title>
        Sign Up
        <v-spacer></v-spacer>
        <v-btn text nuxt to="/"
          >Home
          <v-icon right>mdi-arrow-right</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="signUpForm">
          <v-text-field
            v-model="user.username"
            :dense="isMobile"
            :rules="[rules.min5]"
            validate-on-blur
            label="Username"
            filled
          ></v-text-field>
          <v-text-field
            v-model="user.email"
            :dense="isMobile"
            :rules="[rules.email]"
            validate-on-blur
            label="email"
            type="email"
            filled
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :dense="isMobile"
            :rules="[rules.min7]"
            validate-on-blur
            label="Password"
            type="password"
            filled
          ></v-text-field>
          <v-text-field
            v-model="user.rePassword"
            :dense="isMobile"
            :rules="[rules.match]"
            label="Repeat Password"
            type="password"
            filled
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer> </v-spacer>
        <v-btn text nuxt large to="/user/login">log in</v-btn>
        <v-btn
          elevation="0"
          large
          :loading="loading"
          color="accent"
          class="black--text"
          @click="signUp"
          >Sign up</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Signup",
  layout: "auth",
  middleware: "guest",
  data() {
    return {
      loading: false,
      user: {
        username: "",
        email: "",
        password: "",
        rePassword: ""
      },
      rules: {
        email: v => {
          const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
          return re.test(String(v).toLowerCase()) || "Invalid email";
        },
        min7: v => v?.length >= 7 || "minimum 7 characters",
        min5: v => v?.length >= 5 || "minimum 5 characters",
        match: v => v === this.user.password || "Passwords don't match"
      }
    };
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    }
  },
  methods: {
    async signUp() {
      this.loading = true;
      const valid = this.$refs.signUpForm?.validate();
      if (!valid) {
        this.$store.commit("showAlert", "Invalid input");
        return;
      }
      const { username, email, password } = this.user;
      try {
        const data = await this.$axios.$post("/auth/local/register", {
          name: username,
          email,
          password
        });
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        this.$nuxt.$cookies.set("jwt_token", data.jwt, {
          expires: date
        });
        this.$axios.setToken(data.jwt, "Bearer");
        this.$store.commit("setUser", data.user);
        // await this.$strapi.sendEmailConfirmation({ email });
        this.$store.commit("showAlert", "Account created successfully");
        this.$router.push("/user");
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style></style>
