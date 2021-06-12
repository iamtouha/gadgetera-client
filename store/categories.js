export const namespaced = true;

export const state = () => ({
  loading: false,
  categories: []
});

export const getters = {
  categories: ({ categories }) => categories,
  loading: ({ loading }) => loading
};
export const mutations = {
  SET_CATEGORIES(state, categories) {
    state.categories = categories;
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
    if (state.categories.length) {
      return null;
    }
    commit("LOAD_START");
    try {
      const categories = await this.$repositories.category.get();
      commit("SET_CATEGORIES", categories);
      return null;
    } catch (error) {
      return error;
    } finally {
      commit("LOADED");
    }
  }
};
