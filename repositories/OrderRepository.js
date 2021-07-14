const resource = "/orders";

export default $axios => ({
  get(order_id) {
    if (!order_id) {
      return $axios.$get(resource);
    }
    return $axios.$get(resource + "?order_id=" + order_id);
  },
  create(obj) {
    if (!obj) {
      return new Error("order object not provided");
    }
    return $axios.$post(resource, obj);
  }
});
