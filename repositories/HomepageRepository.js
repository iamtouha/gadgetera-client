const resource = "/homepage";

export default $axios => ({
  get() {
    return $axios.$get(`${resource}`);
  }
});
