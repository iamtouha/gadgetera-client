export default function({ route, redirect }) {
  if (!route.params.order) {
    redirect("/checkout");
  }
}
