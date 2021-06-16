export default function({ $cookies, redirect, store }) {
  const token = $cookies.get("jwt_token");
  if (!token) {
    store.commit("SHOW_ALERT", "Please log in");
    return redirect("/login");
  }
}
