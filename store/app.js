export const namespaced = true;

export const state = () => ({
  searchMenu: false,
  homepageContent: {
    banners: [],
    best_deals: [],
    featured_products: [],
    top_brands: [],
    testimonials: [],
    subcategories: []
  }
});

export const getters = {
  searchMenu: ({ searchMenu }) => searchMenu,
  homepageContent: ({ homepageContent }) => homepageContent
};
export const mutations = {
  SEARCH_MENU_OPEN(state, val) {
    state.searchMenu = val;
  },
  SET_HOMEPAGE_CONTENT(state, payload) {
    state.homepageContent = payload;
  }
};
export const actions = {
  async getHomepageContent({ state, commit }) {
    try {
      if (state.homepageContent?.id) {
        return;
      }
      const content = await this.$repositories.homepage.get();
      commit("SET_HOMEPAGE_CONTENT", content);
    } catch (error) {
      return error;
    }
  }
};
