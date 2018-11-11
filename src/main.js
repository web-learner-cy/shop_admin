import Vue from 'vue'
import App from './App'
import router from './router'

// 引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入common.js
import '@/assets/common.css'

// 将axios挂在到vue原型上
import axios from 'axios'

Vue.prototype.axios = axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 设置全局基础地址

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
  // 在发送请求之前,设置请求头
  config.headers.Authorization = localStorage.getItem('token')
  return config
})
// 添加响应拦截器
axios.interceptors.response.use(function(response) {
  // 对响应数据做点什么
  return response.data
})

Vue.config.productionTip = false

Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
