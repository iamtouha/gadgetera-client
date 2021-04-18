export default function({ store, redirect }) {
  const cartTotal = store.getters["cart/cartTotal"];
  if (cartTotal < 1) {
    store.commit("showAlert", "Please add item to cart");
    redirect("/products");
  }
}
