import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    redirect: 'sysManage/finenterManage',
    hidden: true
  },
  //系统管理
  {
    path: '/sysManage',
    component: Layout,
    meta: {
      title: '系统管理',
      icon: 'eye'
    },
    children: [{
        path: 'finenterManage',
        name: 'finenterManage',
        component: () => import('@/views/sysManage/finenter'),
        meta: {
          title: '财务管理',
        }
      },
      {
        path: 'userManage',
        name: 'userManage',
        component: () => import('@/views/sysManage/userManage'),
        meta: {
          title: '用户管理',
        }
      },
      {
        path: 'bankCard',
        name: 'bankCard',
        component: () => import('@/views/sysManage/bankCard'),
        meta: {
          title: '银行卡管理',
        }
      }
    ]
  },
  //日志管理
  {
    path: '/logManage',
    component: Layout,
    meta: {
      title: '日志管理',
      icon: 'eye-open'
    },
    children:[
      {
        path: 'operationLog',
        name: 'operationLog',
        component: () => import('@/views/logManage/operationLog'),
        meta: {
          title: '操作日志',
        }
      },
      {
        path: 'logMoeny',
        name: 'logMoeny',
        component: () => import('@/views/logManage/logMoeny'),
        meta: {
          title: '资金日志',
        }
      }
    ]

  },
  {
    path: '/account',
    component: Layout,
    meta: {
      title: '资金活动',
      icon: 'eye'
    },
    children: [{
        path: 'settlement',
        name: 'settlement',
        component: () => import('@/views/account/settlement'),
        meta: {
          title: '结算列表',
        }
      },
      {
        path: 'settlement2',
        name: 'settlement2',
        component: () => import('@/views/account/settlement'),
        meta: {
          title: '结算列表',
        }
      }
    ]
  },
  {
    path: '/mcaManage',
    component: Layout,
    meta: {
      title: '商家管理',
      icon: 'eye'
    },
    children: [{
        path: 'list',
        name: 'list',
        component: () => import('@/views/mcaManage/list'),
        meta: {
          title: '商家列表',
        }
      },
      {
        path: 'list2',
        name: 'list2',
        component: () => import('@/views/mcaManage/list'),
        meta: {
          title: '商家列表',
        }
      }
    ]
  },
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
