import { axios } from '@/utils/request'
// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout, // 基础页面布局，包含了头部导航，侧边栏和通知栏
  BlankLayout: BlankLayout, // 空白的布局
  RouteView: RouteView, // 空布局，专门为了二级菜单内容区自定义
  PageView: PageView, // 基础布局，包含了面包屑，和中间内容区 (slot)
  UserLayout: UserLayout, // 登陆注册页面的通用布局

  // 你需要动态引入的页面组件
  analysis: () => import('@/views/dashboard/Analysis'),
  workplace: () => import('@/views/dashboard/Workplace'),
  weclome: () => import('@/views/dashboard/Welcome'),
  monitor: () => import('@/views/dashboard/Monitor'),
  baseForm: () => import('@/views/form/BasicForm'),
  stepForm: () => import('@/views/form/stepForm/StepForm'),
  advancedForm: () => import('@/views/form/advancedForm/AdvancedForm.vue'),
  tableList: () => import('@/views/list/TableList'),
  standardList: () => import('@/views/list/StandardList'),
  cardList: () => import('@/views/list/CardList'),
  search: () => import('@/views/list/search/SearchLayout'),
  article: () => import('@/views/list/search/Article'),
  project: () => import('@/views/list/search/Projects'),
  application: () => import('@/views/list/search/Applications'),
  profileBasic: () => import('@/views/profile/basic/Index'),
  profileAdvanced: () => import('@/views/profile/advanced/Advanced'),
  resultSucc: () => import('@/views/result/Success'),
  resultErr: () => import('@/views/result/Error'),
  error403: () => import('@/views/exception/403'),
  error404: () => import('@/views/exception/404'),
  error500: () => import('@/views/exception/500'),
  center: () => import('@/views/account/center/Index'),
  settings: () => import('@/views/account/settings/Index'),
  base: () => import('@/views/account/settings/BaseSetting'),
  security: () => import('@/views/account/settings/Security'),
  custom: () => import('@/views/account/settings/Custom'),
  binding: () => import('@/views/account/settings/Binding'),
  notification: () => import('@/views/account/settings/Notification'),
  donateList: () => import('@/views/others/DonateList'),
  mifei: () => import('@/views/others/MiFei'),
  gnqc: () => import('@/views/others/Gnqc')
  // selectUser: () => import('@/views/assembly/SelectUser'),
  // selectGroup: () => import('@/views/assembly/SelectGroup'),
  // multipleSelection: () => import('@/views/assembly/MultipleSelection')
  // system
  // userList: () => import('@/views/system/UserList'),
  // roleList: () => import('@/views/system/RoleList'),
  // permissionList: () => import('@/views/system/PermissionList'),
  // deptList: () => import('@/views/system/DeptList'),
  // dictList: () => import('@/views/system/DictList'),
  // distList: () => import('@/views/system/DistList'),
  // configList: () => import('@/views/system/ConfigList'),
  // ossList: () => import('@/views/system/OssList'),
  // monitor
  // operLogList: () => import('@/views/monitor/OperLogList'),
  // loginLogList: () => import('@/views/monitor/LoginLogList'),
  // gen
  // genList: () => import('@/views/gen/GenList'),
  // genEdit: () => import('@/views/gen/GenEdit')
  // ...more
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

// 根级菜单
const rootRouter = {
  'title': '首页',
  'key': '',
  'name': 'index',
  'component': 'BasicLayout',
  'redirect': '/dashboard/weclome',
  'children': []
}

/**
 * 获取后端路由信息的 axios API
 * @returns {Promise}
 */
export const getRouterByUser = () => {
  return axios({
    url: '/system/resources/list/user/SYSTEM',
    method: 'get',
    dataType: 'json'
    /* headers: {
      'Access-Token': 'xxx'
    }
    */
  })
}

/**
 * 获取路由菜单信息
 *
 * 1. 调用 getRouterByUser() 访问后端接口获得路由结构数组
 *    @see https://github.com/sendya/ant-design-pro-vue/blob/feature/dynamic-menu/public/dynamic-menu.json
 * 2. 调用
 * @returns {Promise<any>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    // ajax
    getRouterByUser().then(res => {
      const rootMenu = getRootMenu(res.data)
      const routers = generator(rootMenu)
      console.log('rootMenu', rootMenu)
      console.log('routers', routers)
      routers.push(notFoundRouter)
      resolve(routers)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const currentRouter = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${parent && parent.path || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件 优先根据组件名或者key从constantRouterComponents获取，没有则通过组件名地址查询
      component: constantRouterComponents[item.component || item.key] || loadView(item.component),
      hideChildrenInMenu: item.hideChildrenInMenu || false,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: item.title, icon: item.icon || undefined, hiddenHeaderContent: item.hiddenHeaderContent || false, target: item.target }
    }
    // 隐藏菜单
    if (item.hidden) {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (item.hideChildrenInMenu) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}
export const loadView = (view) => { // 路由懒加载
  return () => import(`@/views/${view}`)
}

export function getRootMenu (rows) {
  // 根菜单
  const rootMenu = []
  const arr = []
  buildtree(rows, arr, '000000')
  arr.forEach(row => {
    menus.push(row)
  })
  rootRouter.children = menus
  rootMenu.push(rootRouter)
  return rootMenu
}

export function buildtree (list, arr, parentId) {
  list.forEach(item => {
    if (item.parentId === parentId) {
      var child = {
        title: item.resName,
        key: item.resKey,
        icon: item.icon,
        hidden: item.visible === '1',
        path: item.path && item.path.length > 0 ? item.path : undefined,
        component: item.component,
        redirect: item.redirect,
        target: item.target,
        // hideChildrenInMenu: item.hiddenChildren,
        // hiddenHeaderContent: item.hiddenHeader,
        children: []
      }
      buildtree(list, child.children, item.id)
      if (child.children.length === 0) {
        delete child.children
      }
      arr.push(child)
    }
  })
}

const menus = [
  {
    'title': '仪表盘',
    'key': 'dashboard',
    'component': 'RouteView',
    'redirect': '/dashboard/weclome',
    'icon': 'dashboard',
    'children': [{
      'title': '分析页',
      'key': 'analysis',
      'icon': ''
    },
    {
      'title': '欢迎页',
      'key': 'weclome',
      'icon': ''
    },
    {
      'title': '工作台',
      'key': 'workplace',
      'icon': ''
    }
    ]
  },
  {
    'title': '表单页',
    'key': 'form',
    'component': 'PageView',
    'icon': 'form',
    'children': [{
      'title': '基础表单',
      'key': 'baseForm',
      'icon': ''
    },
    {
      'title': '分步表单',
      'key': 'stepForm',
      'icon': ''
    },
    {
      'title': '高级表单',
      'key': 'advancedForm',
      'icon': ''
    }
    ]
  },
  {
    'title': '列表页',
    'key': 'list',
    'component': 'PageView',
    'icon': 'table',
    'children': [{
      'title': '查询表格',
      'key': 'tableList',
      'icon': ''
    },
    {
      'title': '标准列表',
      'key': 'standardList',
      'icon': ''
    },
    {
      'title': '卡片列表',
      'key': 'cardList',
      'icon': ''
    },
    {
      'title': '搜索列表',
      'redirect': '/list/search/article',
      'key': 'search',
      'children': [
        {
          'title': '搜索列表（文章）',
          'key': 'article'
        },
        {
          'title': '搜索列表（项目）',
          'key': 'project'
        },
        {
          'title': '搜索列表（应用）',
          'key': 'application'
        }
      ]
    }
    ]
  },
  {
    'title': '详情页',
    'key': 'profile',
    'component': 'RouteView',
    'icon': 'profile',
    'children': [{
      'title': '基础详情页',
      'key': 'profileBasic',
      'icon': ''
    },
    {
      'title': '高级详情页',
      'key': 'profileAdvanced',
      'icon': ''
    }
    ]
  },
  {
    'title': '结果页',
    'key': 'result',
    'component': 'PageView',
    'icon': 'check-circle-o',
    'children': [{
      'hiddenHeaderContent': true,
      'title': '成功',
      'key': 'resultSucc',
      'icon': ''
    },
    {
      'hiddenHeaderContent': true,
      'title': '失败',
      'key': 'resultErr',
      'icon': ''
    }
    ]
  },
  {
    'title': '异常页',
    'key': 'exception',
    'component': 'PageView',
    'icon': 'warning',
    'children': [
      {
        'hiddenHeaderContent': true,
        'title': '403',
        'key': 'error403'
      },
      {
        'hiddenHeaderContent': true,
        'title': '404',
        'key': 'error404'
      },
      {
        'hiddenHeaderContent': true,
        'title': '500',
        'key': 'error500'
      }
    ]
  },
  {
    'title': '个人页',
    'key': 'account',
    'component': 'PageView',
    'icon': 'user',
    'children': [
      {
        'hiddenHeaderContent': true,
        'title': '个人中心',
        'key': 'center'
      },
      {
        'title': '个人设置',
        'key': 'settings',
        'hideChildrenInMenu': true,
        'redirect': '/account/settings/base',
        'children': [
          {
            'hiddenHeaderContent': true,
            'title': '基本设置',
            'key': 'base'
          },
          {
            'hiddenHeaderContent': true,
            'title': '安全设置',
            'key': 'security'
          },
          {
            'hiddenHeaderContent': true,
            'title': '个性化设置',
            'key': 'custom'
          },
          {
            'hiddenHeaderContent': true,
            'title': '账户绑定',
            'key': 'binding'
          },
          {
            'hiddenHeaderContent': true,
            'title': '新消息通知',
            'key': 'notification'
          }
        ]
      }
    ]
  },
  {
    'title': '其他',
    'key': 'others',
    'component': 'PageView',
    'icon': 'interation',
    'children': [
      {
        'title': '捐赠记录',
        'key': 'donateList'
      },
      {
        'title': '米菲孕婴',
        'key': 'mifei'
      },
      {
        'title': '赣南脐橙',
        'key': 'gnqc'
      }
    ]
  },
  {
    'title': '组件',
    'key': 'assembly',
    'component': 'PageView',
    'icon': 'form',
    'children': [
      {
        'title': '选择人员',
        'key': 'selectUser',
        'icon': '',
        'component': 'assembly/SelectUser'
      },
      {
        'title': '选择组织',
        'key': 'selectGroup',
        'icon': '',
        'component': 'assembly/SelectGroup'
      },
      {
        'title': '弹窗多选',
        'key': 'multipleSelection',
        'icon': '',
        'component': 'assembly/MultipleSelection'
      },
      {
        'title': '表格动态行',
        'key': 'dynamicTable',
        'icon': '',
        'component': 'assembly/DynamicTable'
      },
      {
        'title': '动态模块',
        'key': 'dynamicExample',
        'icon': '',
        'component': 'assembly/DynamicExample'
      },
      {
        'title': '待办/已办/草稿',
        'key': 'dealEvent',
        'icon': '',
        'component': 'assembly/DealEvent'
      }
    ]
  }
]
