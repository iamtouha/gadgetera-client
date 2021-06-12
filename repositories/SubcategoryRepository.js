const resource = "/subcategories";

export default $axios => ({
  get({ key } = {}) {
    return $axios.$get(`${resource}${key ? "?key=" + key : ""}`);
  },
  getOne(id) {
    return $axios.$get(`${resource}/${id}`);
  },
  getByCategory({ catId, catKey } = {}) {
    const field = catId ? "category" : "category.key";
    const value = catId || catKey;
    if (!value) {
      return new Error("params not provided");
    }
    return $axios.$get(`${resource}?${field}=${value}`);
  }
});
