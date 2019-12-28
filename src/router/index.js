import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const constantRoutes = [
  // 前台登录
  {
    path: '/login',
    name: '用户登录',
    component: () => import('@/views/Login.vue'),
  },
  // 后台登录
  {
    path: '/admin/login',
    name: '管理员登录',
    component: () => import('@/views/AdminLogin.vue'),
  },
  // 前台用户路由
  {
    path: '/',
    name: 'layout',
    component: () => import('@/views/layout/Layout.vue'),
    redirect: {
      path: '/login'
    },
    children: [{
      path: '/home',
      name: '首页',
      component: () => import('@/views/foreground/Home.vue'),
    }]
  },
  {
    path: '/admin',
    name: 'adminLayout',
    component: () => import('@/views/layout/AdminLayout.vue'),
    redirect: {
      path: '/admin/login'
    },
  }
]
// 后台用户路由
const asyncRoutes = [{
    path: '/admin/user/index',
    name: '用户管理',
    meta: {
      role: ['admin', 'super_admin']
    },
    component: () => import('@/views/background/UserManagement.vue'),
  },
  {
    path: '/admin/order/index',
    name: '订单管理',
    meta: {
      role: ['admin', 'super_admin']
    },
    component: () => import('@/views/background/OrderManagement.vue'),
  },
  {
    path: '/admin/bill/index',
    name: '账单管理',
    meta: {
      role: ['super_admin']
    },
    component: () => import('@/views/background/BillManagement.vue'),
  }
]

const router = new VueRouter({
  routes: constantRoutes
})

function generatorRoutes(role) {
  const accessedRouters = asyncRoutes.filter(route => {
    return route.meta.role.indexOf(role) !== -1
  });
  console.log(accessedRouters)
}

// 前中后台鉴权
function checkGround(to, from, next) {
  if (to.path === '/login' || to.path === '/admin/login') {
    sessionStorage.clear();
  }
  let token
  if (to.path.split("/")[1] === 'admin') {
    token = sessionStorage.getItem('adminToken');
    if (!token && to.path !== '/admin/login') {
      next({
        path: '/admin/login'
      })
    } else {
      next()
    }
  } else {
    token = sessionStorage.getItem('token');
    if (!token && to.path !== '/login') {
      next({
        path: '/login'
      })
    } else {
      next()
    }
  }
}



router.beforeEach((to, from, next) => {
  generatorRoutes('admin');
  checkGround(to, from, next);
})
export default router