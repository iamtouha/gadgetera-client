export const namespaced = true;

export const state = () => ({
  loading: false,
  products: [],
  apiObj: null,
  search: "",
  filter: {
    search: "",
    sortField: "date",
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
  filter: ({ filter }) => filter
};
export const mutations = {
  SET_API_OBJ(state, payload) {
    state.apiObj = payload;
  },
  SORT(state, { field, order }) {
    state.sortField = field;
    state.sortOrder = order;
  },
  SET_BRAND(state, id) {
    state.brand = id;
  },
  SET_CATEGORY(state, id) {
    state.category = id;
  },
  SET_SUBCATEGORY(state, id) {
    state.subcategory = id;
  },
  SET_RANGE(state, { min, max }) {
    if (min) {
      state.filter.minPrice = min;
    }
    if (max) {
      state.filter.maxPrice = max;
    }
  }
};

export const actions = {
  async fetch({ state }) {
    const {
      sortField,
      search,
      sortOrder,
      maxPrice,
      minPrice,
      brand,
      category,
      subcategory
    } = state.filter;
    const query = this.$repositories
      .product()
      .limit(state.limit)
      .search(search)
      .sort(sortField, sortOrder)
      .maxPrice(maxPrice)
      .minPrice(minPrice)
      .brand({ id: brand })
      .category({ id: category })
      .subcategory({ id: subcategory })
      .get();
    try {
      const products = await query;
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
      return null;
    } catch (error) {
      return error;
    }
  }
};
