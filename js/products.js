import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { Toast } from './helper.js';
import { apiUrl, apiPath } from './config.js';

let productModal = '';
let delProductModal = '';

const app = createApp({
  data() {
    return {
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
      isLoading: true,
    };
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common.Authorization = token;
    this.checkAdmin();
    productModal = new bootstrap.Modal(document.getElementById('productModal'));
    delProductModal = new bootstrap.Modal(
      document.getElementById('delProductModal')
    );
  },
  methods: {
    checkAdmin() {
      axios
        .post(`${apiUrl}/api/user/check`)
        .then((_res) => {
          this.getProducts();
        })
        .catch((err) => {
          const errMessage = err.response
            ? err.response.data.message
            : err.data?.message;
          Toast.fire({
            title: `${errMessage}`,
            icon: 'error',
          });
          window.location = 'login.html';
        });
    },
    getProducts() {
      axios
        .get(`${apiUrl}/api/${apiPath}/admin/products`)
        .then((res) => {
          this.products = res.data.products;
          this.isLoading = false;
        })
        .catch((err) => {
          const errMessage = err.response
            ? err.response.data.message
            : err.data?.message;
          this.isLoading = false;
          Toast.fire({
            title: `${errMessage}`,
            icon: 'error',
          });
        });
    },
    openModal(type, item) {
      if (type === 'new') {
        this.isNew = true;
        this.tempProduct = {
          imagesUrl: [],
        };
        productModal.show();
      } else if (type === 'edit') {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (type === 'del') {
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },
    updateProduct() {
      let httpMethod = 'post';
      let url = `${apiUrl}/api/${apiPath}/admin/product`;
      if (!this.isNew) {
        httpMethod = 'put';
        url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
      }
      axios[httpMethod](url, { data: this.tempProduct })
        .then((res) => {
          Toast.fire({
            title: `${res.data.message}`,
            icon: 'success',
          });
          this.isLoading = true;
          this.getProducts();
        })
        .catch((err) => {
          const errMessage = err.response
            ? err.response.data.message
            : err.data?.message;
          Toast.fire({
            title: `${errMessage}`,
            icon: 'error',
          });
        });
      productModal.hide();
    },
    delProduct() {
      axios
        .delete(`${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`)
        .then((res) => {
          Toast.fire({
            title: `${res.data.message}`,
            icon: 'success',
          });
          this.getProducts();
          this.isLoading = true;
        })
        .catch((err) => {
          const errMessage = err.response
            ? err.response.data.message
            : err.data?.message;
          Toast.fire({
            title: `${errMessage}`,
            icon: 'error',
          });
        });
      delProductModal.hide();
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },
});
// app.component...
app.mount('#app');
