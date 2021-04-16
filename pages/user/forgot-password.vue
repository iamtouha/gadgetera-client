<template>
  <v-card dark class="semi-transparent-dark" elevation="0">
    <v-card-title>
      Forgot Password?
      <v-spacer></v-spacer>
      <v-btn text nuxt to="/"
        >Home
        <v-icon right>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <p>Enter your email</p>
      <v-form ref="emailForm">
        <v-text-field
          v-model="email"
          :rules="[rules.email]"
          dark
          validate-on-blur
          label="Email"
          filled
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer> </v-spacer>
      <v-btn dark text large nuxt to="/user/login">cancel</v-btn>
      <v-btn
        elevation="0"
        large
        :loading="loading"
        color="accent"
        class="black--text"
        @click="forgotPass"
      >
        Reset
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ForgotPassword",
  layout: "auth",
  middleware: "guest",
  data() {
    return {
      loading: false,
      email: "",
      rules: {
        email: v => {
          const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
          return re.test(String(v).toLowerCase()) || "Invalid email";
        }
      }
    };
  },
  methods: {
    forgotPass() {
      this.loading = true;
      const valid = this.$refs.emailForm?.validate();
      if (!valid) {
        this.$nuxt.$emit("alert", "Invalid input");
        return;
      }
      this.$axios
        .$post("/auth/forgot-password", { email: this.email })
        .then(() =>
          this.$nuxt.$emit(
            "auth-alert",
            "Reset password link sent to your email."
          )
        )
        .catch(err => console.error(err))
        .finally(() => (this.loading = false));
    }
  }
};
</script>
