export const namespaced = true;

export const state = () => ({});

export const getters = {
  filterDrawer: ({ filterDrawer }) => filterDrawer
};
export const mutations = {
  FILTER_DRAWER_OPEN(state, val) {
    state.filterDrawer = val;
  }
};
