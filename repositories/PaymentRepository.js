const resource = "/payment";

export default $axios => ({
  get() {
    return $axios.$get(resource);
  }
});
