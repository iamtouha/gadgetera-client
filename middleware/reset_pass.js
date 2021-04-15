export default function({ redirect, query, store }) {
  if (!query.code) {
    store.commit("showAlert", "Reset code not found");
    return redirect("/");
  }
}
