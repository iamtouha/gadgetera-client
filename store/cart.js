export default {
  namespaced: true,
  state() {
    return {
      cart: [],
      discount: null
    };
  },
  getters: {
    discount: ({ discount }) => discount,
    cart: ({ cart }) => cart,
    cartTotal({ cart }) {
      return cart.reduce((acc, cart) => {
        acc += cart.price * cart.quantity;
        return acc;
      }, 0);
    }
  },
  mutations: {
    addDiscount(state, payload) {
      state.discount = payload;
    },
    addToCart(state, payload) {
      const index = state.cart.findIndex(
        item =>
          item.product.id === payload.product.id &&
          item.variant.id === payload.variant.id
      );
      if (index > -1) {
        state.cart.splice(index, 1, payload);
        return;
      }
      state.cart.push(payload);
    },
    removeFromCart(state, payload) {
      const index = state.cart.findIndex(
        item =>
          item.product.id === payload.product.id &&
          item.variant.id === payload.variant.id
      );
      if (index > -1) {
        state.cart.splice(index, 1);
      }
    },
    discardCart(state) {
      state.cart = [];
    }
  }
};
