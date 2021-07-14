const resource = "/reviews";

export default $axios => ({
  get(order_id) {
    if (!order_id) {
      return;
    }
    return $axios.$get(resource + "?order.order_id=" + order_id);
  },
  create(obj) {
    if (!obj) {
      return new Error("order object not provided");
    }
    return $axios.$post(resource, obj);
  }
});
