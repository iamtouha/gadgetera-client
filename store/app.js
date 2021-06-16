export const namespaced = true;

export const state = () => ({
  searchMenu: false
});

export const getters = {
  searchMenu: ({ searchMenu }) => searchMenu
};
export const mutations = {
  SEARCH_MENU_OPEN(state, val) {
    state.searchMenu = val;
  }
};
