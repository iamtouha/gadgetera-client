const resource = "/auth/local";

export default $axios => ({
  get() {
    return $axios.$get("users/me");
  },
  login(obj) {
    if (!obj) {
      return new Error("order object not provided");
    }
    return $axios.$post(resource, obj);
  },
  register(obj) {
    if (!obj) {
      return new Error("order object not provided");
    }
    return $axios.$post(resource + "/register", obj);
  },
  address(id) {
    return $axios.$get("/addresses/" + id);
  },
  forgotPassword(email) {
    return $axios.$post("/auth/forgot-password", { email });
  },
  resetPassword(obj) {
    return $axios.$post("/auth/reset-password", obj);
  }
});
