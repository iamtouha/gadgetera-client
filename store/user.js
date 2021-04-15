export default {
  namespaced: false,
  state() {
    return {
      user: null
    };
  },
  getters: {
    user: ({ user }) => user
  },
  mutations: {
    setUser(state, user) {
      const { name, email, confirmed } = user;
      state.user = { name, email, confirmed };
    },
    signOut(state, { $cookies, $router }) {
      const date = new Date();
      date.setFullYear(1970);
      this.$axios.setToken(false);
      $cookies.remove("jwt_token", {
        expires: date
      });
      $router.push("/");
      state.user = null;
    },
    setCookie(name, value, days) {
      var expires = "";
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    },
    getCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },
    eraseCookie(name) {
      document.cookie =
        name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
  }
};
