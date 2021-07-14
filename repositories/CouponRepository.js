const resource = "/coupons";

export default $axios => ({
  get(code) {
    if (!code) {
      return;
    }
    return $axios.$get(resource + "/" + code);
  }
});
