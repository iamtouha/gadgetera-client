/* eslint-disable curly */
export const namespaced = true;

export const state = () => ({
  items: []
});
export const getters = {
  cartItems: ({ items }) => items,
  cartTotal: ({ items }) => {
    return items.reduce((acc, item) => {
      acc += item.unitPrice * item.quantity;
      return acc;
    }, 0);
  }
};
export const mutations = {
  ADD_TO_CART(state, payload) {
    if (!state.items.length >= 6) return;

    const similarItem = state.items.find(
      item => item.product.id === payload.product.id
    );
    if (!similarItem) {
      const { id, images, name, price, discount, slug } = payload.product;
      return state.items.push({
        product: {
          id,
          image: images[0].formats.thumbnail.url,
          name,
          price,
          discount,
          slug
        },
        quantity: payload.quantity,
        unitPrice: price - price * discount
      });
    }
    similarItem.quantity += 1;
  },
  REMOVE_FROM_CART(state, productId) {
    const index = state.items.findIndex(item => item.product.id === productId);
    if (index >= 0) {
      state.items.splice(index, 1);
    }
  },
  INCREMENT(state, productId) {
    const item = state.items.find(item => item.product.id === productId);
    if (item && item.quantity < 9) {
      item.quantity += 1;
    }
  },
  DECREMENT(state, productId) {
    const item = state.items.find(item => item.product.id === productId);
    if (!item) return;

    switch (item.quantity) {
      case 1: {
        const index = state.items.findIndex(
          item => item.product.id === productId
        );
        state.items.splice(index, 1);
        break;
      }
      default: {
        item.quantity -= 1;
        break;
      }
    }
  },
  SAVE_CART(state) {
    this.$cookies.set("cart", state.items);
  },
  DUMP_CART(state) {
    state.items = [];
  },
  SET_CART(state) {
    const cart = this.$cookies.get("cart");
    if (cart) state.items = cart;
  }
};
