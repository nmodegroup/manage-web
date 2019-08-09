import Vue from 'vue'
import Router from 'vue-router'
import hump from './libs/hump'
import Page from './views/layout/Page'
//自由路由，路由优先级高于页面路由
const routes = [
  {path: '/login', name: 'login', meta: {title: '登录'}, component: resolve => { require(['./views/home/login'], resolve) }}
];
// 页面路由
let pages = [
    {path: '/user/account', meta: {title: '用户账号'}, component: resolve => { require(['./views/user/account'], resolve) }},
    {path: '/user/book/place', meta: {title: '桌位预订'}, component: resolve => { require(['./views/user/book-place'], resolve) }},
    {path: '/', redirect: '/user/account'}
  ]
// 页面
pages.forEach(r => {
  r.name = hump(r.path)
  console.log(r.name)
  Vue.component(r.name, r.component)
})
// 放在最后
routes.push({path: '/*', component: Page, children: pages})
Vue.use(Router)
const router = new Router({
  linkActiveClass: 'active',
  mode: 'history',
  routes: routes
})
router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    next()
})
export default router;