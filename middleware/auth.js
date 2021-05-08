export default function({ $cookies, redirect, store }) {
  const token = $cookies.get("jwt_token");
  if (!token) {
    store.commit("SHOW_ALERT", "Please sign up first");
    return redirect("/signup");
  }
}
