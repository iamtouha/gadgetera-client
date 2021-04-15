export default function({ redirect, $cookies }) {
  const token = $cookies.get("jwt_token");
  if (token) {
    return redirect("/user");
  }
}
