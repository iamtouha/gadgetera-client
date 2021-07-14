export default function({ $cookies, redirect, store, route }) {
  const token = $cookies.get("jwt_token");
  if (token) {
    store.commit("SHOW_ALERT", "Already logged In");
    return redirect("/account");
  }
  if (!route.query.code) {
    store.commit("SHOW_ALERT", "Invalid Link");
    redirect("/login");
  }
}
