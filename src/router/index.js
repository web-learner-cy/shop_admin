import Vue from 'vue'
import Router from 'vue-router'
// 导入登录组件
import Login from '@/components/Login.vue'

// 导入Home组件
import Home from '@/components/Home.vue'

// 导入Users组件
import Users from '@/components/Users.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/users',
          component: Users
        }
      ]
    }
  ]
})
// 全局守卫
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  if (token || to.path === '/login') {
    // 有 跳转到对应的页面
    next()
  } else {
    // 没有 跳转到登录页
    next('/login')
  }
})
export default router
