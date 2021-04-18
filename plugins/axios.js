export default function({ $axios, store }) {
  // $axios.onRequest(config => {
  //   console.log(config.url);
  // });
  $axios.onError(error => {
    const message = error.response?.data?.data?.[0]?.messages?.[0].message;
    const altMessage = error.response.data?.message;
    console.log(message || error.message);
    store.commit("showAlert", message || altMessage || error.message);
  });
}
