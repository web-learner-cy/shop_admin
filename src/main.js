import Vue from 'vue'
import App from './App'
import router from './router'

// 引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入common.js
import '@/assets/common.css'
import axios from 'axios'
// 引入element-tree-grid
import ElTreeGrid from 'element-tree-grid'

// 引入moment时间格式化插件
import moment from 'moment'

import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

Vue.filter('dataFilter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input * 1000).format(format)
})

// 一个树状的表格插件
Vue.component(ElTreeGrid.name, ElTreeGrid)

// 将axios挂在到vue原型上
Vue.prototype.axios = axios
// 设置全局基础地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

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
