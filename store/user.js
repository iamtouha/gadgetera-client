export default {
  namespaced: false,
  state() {
    return {
      user: null
    };
  },
  getters: {
    user: ({ user }) => user
  },
  mutations: {
    setUser(state, user) {
      const { id, name, email, address } = user;

      state.user = { id, name, email, address };
      if (address && typeof address !== "string") {
        const {
          receiver,
          phone,
          district,
          sub_district,
          street_address
        } = address;
        state.user.address = {
          receiver,
          phone,
          district,
          sub_district,
          street_address
        };
      }
    },
    SET_ADDRESS(state, address) {
      const {
        receiver,
        phone,
        district,
        sub_district,
        street_address
      } = address;
      state.user.address = {
        receiver,
        phone,
        district,
        sub_district,
        street_address
      };
    },
    signOut(state, { $cookies, $router }) {
      const date = new Date();
      date.setFullYear(1970);
      this.$axios.setToken();
      $cookies.remove("jwt_token", {
        expires: date
      });
      $router.push("/");
      state.user = null;
    }
  },
  actions: {
    async findAddress({ state, commit }) {
      const addressId = state.user?.address;
      if (!addressId || typeof addressId !== "string") return;
      try {
        const address = await this.$axios.$get("/addresses/" + addressId);
        commit("SET_ADDRESS", address);
      } catch (error) {
        commit("showAlert", error.message);
      }
    }
  }
};
