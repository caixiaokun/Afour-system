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
      },{
        path: 'userManage',
        name: 'userManage',
        component: () => import('@/views/sysManage/userManage'),
        meta: {
          title: '用户管理',
        }
      }
    ]
  },
  // 素材管理
  {
    path: '/material',
    component: Layout,
    redirect: '/material/upload',
    meta: {
      title: '素材管理',
      icon: 'plane'
    },
    children: [{
        path: 'check-template',
        name: 'check-template',
        component: () => import('@/views/material/check-template'),
        meta: {
          title: '查看模板',
        }
      },
      {
        path: 'logo',
        name: 'logo',
        component: () => import('@/views/material/check-logo'),
        meta: {
          title: '查看logo',
        }
      },
      {
        path: 'generate',
        name: 'generate',
        component: () => import('@/views/material/generate'),
        meta: {
          title: '生成素材',
        }
      },
      {
        path: 'check',
        name: 'check',
        component: () => import('@/views/material/check'),
        meta: {
          title: '查看素材',
        }
      },
    ]
  },

  //测试页面
  {
    path: '/',
    component: Layout,
    children: [{
      path: 'test',
      name: 'test',
      component: () => import('@/views/test/test'),
      meta: {
        title: '测试',
      }
    }]
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
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
