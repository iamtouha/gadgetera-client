const resource = "/categories";

export default $axios => ({
  get({ key } = {}) {
    return $axios.$get(`${resource}${key ? "?key=" + key : ""}`);
  },
  getOne(id) {
    return $axios.$get(`${resource}/${id}`);
  }
});
