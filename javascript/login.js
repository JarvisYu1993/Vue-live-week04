const app = {
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io',
      user: {
        username: '',
        password: '',
      },
      page: 'products',
    };
  },
  methods: {
    login() {
      axios.post(`${this.apiUrl}/admin/signin`, this.user).then((response) => {
        if(response.data.success) {
          const { token, expired } = response.data;
          // 寫入 cookie token
          // expires 設置有效時間
          document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;

          window.location = `${this.page}.html`;
        } else {
          alert(response.data.message);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
  },
};
Vue.createApp(app).mount('#app');
