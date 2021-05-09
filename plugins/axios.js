export default function({ $axios, store }) {
  $axios.onRequest(config => {
    if (store.state.token) {
      config.headers.Authorization = "Bearer " + store.state.token;
    }
    return config;
  });

  $axios.onError(error => {
    let message = error.message;
    if (error.response && error.response.data) {
      const [msg] = error.response.data.message;
      if (msg && msg.messages && msg.messages.length) {
        message = msg.messages[0].message;
      } else if (error.response.data.message) {
        message = error.response.data.message;
      }
    }
    store.commit("SHOW_ALERT", message);
  });
}
