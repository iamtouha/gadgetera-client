export default function(context) {
  const { $cookies, redirect, store } = context;
  const token = $cookies.get("jwt_token");
  const user = store.getters["user"];
  if (!token) {
    return redirect("/user/signup");
  }
  if (!user) {
    store.dispatch("nuxtClientInit", context);
  }
}
