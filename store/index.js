export function state() {
  return {
    snackbar: false,
    message: "",
    products: []
  };
}
export const getters = {
  snackbar: ({ snackbar }) => snackbar,
  message: ({ message }) => message,
  products: ({ products }) => products
};
export const mutations = {
  showAlert(state, message) {
    state.snackbar = true;
    state.message = message;
  },
  hideAlert(state) {
    state.snackbar = false;
  },
  addProducts(state, payload) {
    state.products = payload.map(product => {
      const variant = product.variants.find(item => item.inStock);
      const photo = product.photos[0];
      return {
        thumbnail: photo.formats?.thumbnail.url || photo.url,
        photo: photo.url,
        caption: photo.caption,
        name: product.name,
        slug: product.slug,
        price: variant ? variant.price : product.variants[0].price,
        brand: product.brand.name,
        category: product.brand.category
      };
    });
  }
};

export const actions = {
  async nuxtServerInit({ commit }) {
    const products = await this.$axios.$get(
      "/products?_sort=createdAt:DESC&_limit=300"
    );
    commit("addProducts", products);
  },
  nuxtClientInit({ commit }, { $cookies, $axios, redirect }) {
    const token = $cookies.get("jwt_token");
    if (!token) return;

    $axios.setToken(token, "Bearer");
    $axios
      .$get("/users/me")
      .then(user => commit("setUser", user))
      .catch(err => {
        console.log(err);
        if ([401, 403].includes(err.response?.status)) {
          $cookies.remove("jwt_token", {
            expires: new Date("1970-01-01")
          });
        }
        redirect("/");
      });
  }
};
