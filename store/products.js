export const namespaced = true;

export const state = () => ({
  loading: false,
  reloading: false,
  products: [],
  filter: {
    search: "",
    sortField: "published_at",
    sortOrder: "desc",
    maxPrice: null,
    minPrice: null,
    brand: "",
    category: "",
    subcategory: ""
  },
  limit: 12
});

export const getters = {
  products: ({ products }) => products,
  loading: ({ loading }) => loading,
  reloading: ({ reloading }) => reloading,
  filter: ({ filter }) => filter,
  search: ({ filter }) => filter.search
};
export const mutations = {
  APPEND_PRODUCTS(state, payload) {
    const products = payload.map(product => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      photo: product.images[0],
      subcategory: product.subcategory,
      brand: product.brand,
      stock: product.stock,
      price: product.price,
      discount: product.discount
    }));
    state.products = [...state.products, ...products];
  },
  SET_PRODUCTS(state, products) {
    state.products = products.map(product => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      photo: product.images[0],
      subcategory: product.subcategory,
      brand: product.brand,
      stock: product.stock,
      price: product.price,
      discount: product.discount
    }));
  },
  SORT(state, { field, order }) {
    state.filter.sortField = field;
    state.filter.sortOrder = order;
  },
  SET_BRAND(state, id) {
    state.filter.brand = id;
  },
  SET_CATEGORY(state, id) {
    state.filter.category = id;
  },
  SET_SUBCATEGORY(state, id) {
    state.filter.subcategory = id;
  },
  SET_RANGE(state, [min, max]) {
    state.filter.minPrice = min;
    state.filter.maxPrice = max;
  },
  RESET_FILTER(state) {
    state.filter = {
      search: "",
      sortField: "published_at",
      sortOrder: "desc",
      maxPrice: null,
      minPrice: null,
      brand: "",
      category: "",
      subcategory: ""
    };
    state.products = [];
  },
  SET_SEARCH(state, text) {
    state.filter.search = text;
  },
  RELOAD_START(state) {
    state.reloading = true;
  },
  LOAD_START(state) {
    state.loading = true;
  },
  LOADED(state) {
    state.loading = false;
  },
  RELOADED(state) {
    state.reloading = false;
  }
};

export const actions = {
  async fetchAll({ state, commit }, { forced } = {}) {
    if (state.products.length && !forced) {
      return null;
    }
    commit("LOAD_START");
    try {
      const resource = this.$repositories.product;
      const products = await resource.get(state.filter, { limit: state.limit });
      commit("SET_PRODUCTS", products);
      return null;
    } catch (error) {
      return error;
    } finally {
      commit("LOADED");
    }
  },
  async reFetch({ state, commit }) {
    commit("RELOAD_START");
    try {
      const products = await this.$repositories.product.get(state.filter, {
        start: state.products.length,
        limit: state.limit
      });
      commit("APPEND_PRODUCTS", products);
      if (!products.length) {
        commit("SHOW_ALERT", "No more products available", { root: true });
      }
      return null;
    } catch (error) {
      return error;
    } finally {
      commit("RELOADED");
    }
  }
};
