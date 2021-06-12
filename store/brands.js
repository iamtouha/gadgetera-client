export const namespaced = true;

export const state = () => ({
  loading: false,
  brands: []
});

export const getters = {
  brands: ({ brands }) => brands,
  loading: ({ loading }) => loading
};
export const mutations = {
  SET_BRANDS(state, brands) {
    state.brands = brands;
  },
  LOAD_START(state) {
    state.loading = true;
  },
  LOADED(state) {
    state.loading = false;
  }
};

export const actions = {
  async fetchAll({ state, commit }) {
    if (state.brands.length) {
      return null;
    }
    commit("LOAD_START");
    try {
      const brands = await this.$repositories.brand.get();
      commit("SET_BRANDS", brands);
      return null;
    } catch (error) {
      return error;
    } finally {
      commit("LOADED");
    }
  }
};
