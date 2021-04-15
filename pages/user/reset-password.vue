<template>
  <div style="display:contents;">
    <v-card rounded class="semi-transparent-dark" elevation="0">
      <v-card-title>
        Reset Password
        <v-spacer></v-spacer>
        <v-btn text nuxt to="/"
          >Home
          <v-icon right>mdi-arrow-right</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="changePassForm">
          <v-text-field
            v-model="user.newPassword"
            :dense="isMobile"
            :rules="[rules.min7]"
            validate-on-blur
            label="New Password"
            type="password"
            filled
          ></v-text-field>
          <v-text-field
            v-model="user.rePassword"
            :dense="isMobile"
            :rules="[rules.match]"
            label="Repeat New Password"
            type="password"
            filled
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer> </v-spacer>
        <v-btn text nuxt large to="/user">cancel</v-btn>
        <v-btn
          elevation="0"
          large
          color="accent"
          class="black--text"
          @click="changePass"
          :loading="loading"
          >Reset</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "ResetPassword",
  layout: "auth",
  middleware: "reset_pass",
  data() {
    return {
      loading: false,
      user: {
        newPassword: "",
        rePassword: ""
      },
      rules: {
        email: v => {
          const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
          return re.test(String(v).toLowerCase()) || "Invalid email";
        },
        min7: v => v?.length >= 7 || "minimum 7 characters",
        match: v => v === this.user.newPassword || "Passwords don't match"
      }
    };
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
    code() {
      return this.$route.query.code;
    }
  },
  created() {
    console.log(this.$axios.setToken);
  },
  methods: {
    changePass() {
      const valid = this.$refs.changePassForm?.validate();
      if (!valid) {
        this.$store.commit("showAlert", "Invalid input");
        return;
      }
      if (!this.code) {
        this.$store.commit("showAlert", "Reset code not found");
        return;
      }
      this.loading = true;
      this.$axios
        .$post("/auth/reset-password", {
          code: this.code,
          password: this.user.newPassword,
          passwordConfirmation: this.user.rePassword
        })
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
        .catch(err => console.error(err))
        .finally(() => (this.loading = false));
    }
  }
};
</script>
