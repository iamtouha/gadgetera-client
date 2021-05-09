/* eslint-disable camelcase, no-console */
export const state = () => ({
  user: null,
  address: null,
  alertMessage: null,
  token: null
});

export const getters = {
  user: ({ user }) => user || {},
  isLoggedIn: ({ user }) => Boolean(user),
  address: ({ address }) => address,
  token: ({ token }) => token,
  alertMessage: ({ alertMessage }) => alertMessage,
  snackbar: ({ alertMessage }) => Boolean(alertMessage)
};
export const mutations = {
  SET_USER(state, { name, email }) {
    state.user = { name, email };
  },
  SET_TOKEN(state, jwt) {
    state.token = jwt;
  },
  SET_ADDRESS(state, address) {
    state.address = address;
  },
  LOG_OUT(state) {
    state.user = null;
    state.address = null;
    state.token = null;
  },
  HIDE_ALERT(state) {
    state.alertMessage = null;
  },
  SHOW_ALERT(state, message) {
    state.alertMessage = message;
  }
};

export const actions = {
  async nuxtClientInit({ commit }, { $cookies, $axios }) {
    try {
      const token = $cookies.get("jwt_token");
      if (token) {
        commit("SET_TOKEN", token);
        const { id, email, name, address } = await $axios.$get("/users/me");
        commit("SET_USER", { id, email, name });
        if (address) {
          const {
            receiver,
            district,
            sub_district,
            email,
            phone,
            street_address
          } = await $axios.$get("/addresses/" + address);

          commit("SET_ADDRESS", {
            receiver,
            district,
            sub_district,
            email,
            phone,
            street_address
          });
        }
      }
      commit("cart/SET_CART");
    } catch (error) {
      console.log(error);
    }
  },
  async logIn({ commit }, payload) {
    const { user, jwt } = await this.$axios.$post("/auth/local", {
      identifier: payload.email,
      password: payload.password
    });
    this.$cookies.set("jwt_token", jwt);
    commit("SET_TOKEN", jwt);
    commit("SHOW_ALERT", `Welcome back, ${user.name}!`);
    commit("SET_USER", user);
    commit("SET_ADDRESS", user.address);
  },
  async signUp({ commit }, payload) {
    try {
      const { user, jwt } = await this.$axios.$post(
        "/auth/local/register",
        payload
      );
      commit("SHOW_ALERT", "Signup successful. Thanks for joining us!");
      this.$cookies.set("jwt_token", jwt);
      commit("SET_TOKEN", jwt);
      commit("SET_USER", user);
    } catch (error) {
      return error;
    }
  },
  logOut({ commit }) {
    this.$cookies.remove("jwt_token");
    this.$cookies.remove("cart");
    return commit("LOG_OUT");
  }
};
