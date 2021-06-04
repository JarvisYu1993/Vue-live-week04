import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from '../javascript/pagination.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/api';
const apiPath = 'maroon5';

let productModal = null;
let delProductModal = null;

createApp({
  data() {
    return {
      token: '',
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
      pagination:{},
      image:{},
    }
  },
  components:{
    pagination
  },
  mounted() {
    // 取出 Token
    this.token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    if (this.token  === '') {
      alert('您尚未登入請重新登入。');
      window.location = 'login.html';
    }
    axios.defaults.headers.common.Authorization = this.token ;
    this.getProduct();
  },
  methods: {
    getProduct(page = 1) {
      const url = `${apiUrl}/${apiPath}/admin/products?page=${page}`;
      axios.get(url).then((res) => {
        if (res.data.success) {
          this.products = res.data.products;
          this.pagination = res.data.pagination;
        } else {
          alert(res.data.message);
        }
      }).catch(error=>{
        console.log(error);
      })
    },
    openModal(isNew, product) {
      if(isNew === 'new'){
        this.isNew = true;
        this.tempProduct = {
          imagesUrl: [],
        }
        productModal.show();
      }else if(isNew === 'edit'){
        this.isNew = false;
        this.tempProduct = {...product};
        productModal.show();
      }else if(isNew === 'delete'){
        this.isNew = false;
        this.tempProduct = {...product};
        delProductModal.show();
      }
    },
    logout() {
      const url = `https://vue3-course-api.hexschool.io/logout`;
      axios.post(url)
        .then((res) => {
            if (res.data.success) {
              alert('已登出成功')
              this.token = document.cookie = 'hexToken=; expires=; path=/';
              window.location = 'login.html';
            }else{
              alert(res.data.message)
              console.log(res);
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }, 
  },
})
.component('productModal',{
  template: `#productModal`,
  props:{
    product:{
      type: Object,
      default(){
        return{
          imagesUrl: [],
        }
      }    
    },
    isNew:{
      type: Boolean,
      default: false
    }
  },
  data(){
    return{
      modal: null
    }
  },
  mounted(){
    productModal = new bootstrap.Modal(document.querySelector('#productModal'), {
      keyboard: false,
    });
  },
  methods:{
    updateProduct() {
      let url = `${apiUrl}/${apiPath}/admin/product`;
      let method = 'post';
      
      if(!this.isNew) {
        url = `${apiUrl}/${apiPath}/admin/product/${this.product.id}`;
        method = 'put'
      }

      axios[method](url,  { data: this.product }).then((res) => {
        if(res.data.success) {
          alert(res.data.message);
          this.hideModal();
          this.$emit('update')
        } else {
          alert(res.data.message);
        }
      }).catch(error=>{
        alert(error.data.message);
      })
    },
    createImages() {
      this.product.imagesUrl = [];
      this.product.imagesUrl.push('');
    },
    openModal() {
      productModal.show();
    },
    hideModal() {
      productModal.hide();
    },
  }
})
.component('delProductModal',{
  template: "#delProductModal",
  props:{
    deleteItem:{
      type: Object,
      default(){
        return{
        }
      }    
    }
  },
  data() {
    return {
      modal: null,
    };
  },
  mounted(){
    delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'),  {
      keyboard: false,
      backdrop: 'static'
    });
  },
  methods:{
    delProduct() {
      const url = `${apiUrl}/${apiPath}/admin/product/${this.deleteItem.id}`;
      axios.delete(url).then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          this.hideModal();
          this.$emit('delete')
        } else {
          alert(res.data.message);
        }
      }).catch(error=>{
        alert(error.data.message);
      });
    },
    openModal() {
      delProductModal.show();
    },
    hideModal() {
      delProductModal.hide();
    },
  }
}).mount('#app');
