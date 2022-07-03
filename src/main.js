// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import qs from 'qs'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//使用elementUi
Vue.use(ElementUI);
//阻止启动生产消息
Vue.config.productionTip = false
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    //把payload类型的参数哦转为fromdata格式
    config.data = qs.stringify(config.data,{allowDots:true});
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    if (response.data.code==403){
      vue.$router.push("/")
    }
    return response;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
//允许跨域携带cookie
axios.defaults.withCredentials=true;
//请求路径前缀
axios.defaults.baseURL='http://localhost:8080/'
//把 axios绑定到vue对象上 以后用 this.$http使用
Vue.prototype.$http=axios;
//把 http://localhost:8848/img/绑定到vue对象上 以后用 this.$imgServer使用
Vue.prototype.$imgServer='http://localhost:8848/img/';
/* eslint-disable no-new */
let vue = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
