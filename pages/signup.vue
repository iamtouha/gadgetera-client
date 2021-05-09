<template>
  <v-container class="fill-height">
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card outlined>
          <v-card-title>
            Sign Up
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="user.name"
              label="Name"
              placeholder="Name"
              single-line
            />
            <v-text-field
              v-model="user.email"
              label="Email"
              placeholder="Email"
              type="email"
              single-line
            />
            <v-text-field
              v-model="user.password"
              :type="viewPass ? 'text' : 'password'"
              label="Password"
              placeholder="Password"
              single-line
              :append-icon="viewPass ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="viewPass = !viewPass"
            />
            <v-text-field
              v-model="user.repeatPassword"
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
            <v-btn class="primary" :loading="loading" text @click="signup">
              Sign up
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
  name: "Signup",
  middleware: "guest",
  data: () => ({
    loading: false,

    user: {
      name: "",
      email: "",
      password: "",
      repeatPassword: ""
    },
    viewPass: false
  }),
  head() {
    return {
      title: "Sign Up"
    };
  },
  methods: {
    ...mapMutations(["SHOW_ALERT"]),
    signup() {
      // eslint-disable-next-line
      const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      const { name, email, password, repeatPassword } = this.user;
      const filledUp = Object.keys(this.user).every(key => !!this.user[key]);
      if (!filledUp) {
        this.SHOW_ALERT("Please fill up the form");
      } else if (!re.test(email.toLowerCase())) {
        this.SHOW_ALERT("Email is invalid");
      } else if (password !== repeatPassword) {
        this.SHOW_ALERT("Passwords don't match");
      } else if (password.length < 7) {
        this.SHOW_ALERT("Password is too short");
      } else if (name.length < 5) {
        this.SHOW_ALERT("Name is too short");
      } else {
        this.loading = true;

        this.$store
          .dispatch("signUp", { username: name, email, password })
          .then(() => this.$nuxt.$router.push("/account"))
          .catch(err => err)
          .finally(() => {
            this.loading = false;
          });
      }
    }
  }
};
</script>
