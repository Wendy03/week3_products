import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { Toast } from './helper.js';
import { apiUrl } from './config.js';

const app = createApp({
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      isProcessing: false,
    };
  },
  methods: {
    login() {
      this.isProcessing = true;
      axios
        .post(`${apiUrl}/admin/signin`, this.user)
        .then((res) => {
          const { token, expired, message } = res.data;
          Toast.fire({
            title: `${message}`,
            icon: 'success',
          });
          document.cookie = `hexToken=${token}; expires=${expired}`;
          window.location = 'products.html';
        })
        .catch((err) => {
          const errMessage = err.response
            ? err.response.data.message
            : err.data?.message;
          this.isProcessing = false;
          Toast.fire({
            title: `${errMessage}`,
            icon: 'error',
          });
        });
    },
  },
});
// app.component...
app.mount('#app');
