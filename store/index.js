export function state() {
  return {
    snackbar: false,
    message: ""
  };
}
export const getters = {
  snackbar: ({ snackbar }) => snackbar,
  message: ({ message }) => message
};
export const mutations = {
  showAlert(state, message) {
    state.snackbar = true;
    state.message = message;
  },
  hideAlert(state) {
    state.snackbar = false;
  }
};

export const actions = {
  nuxtClientInit({ commit }, { $cookies, $axios, redirect }) {
    const token = $cookies.get("jwt_token");
    if (!token) return;

    $axios.setToken(token, "Bearer");
    $axios
      .$get("/users/me")
      .then(user => commit("setUser", user))
      .catch(err => {
        if ([401, 403].includes(err.response.status)) {
          $cookies.remove("jwt_token");
        }
        redirect("/");
      });
  }
};
