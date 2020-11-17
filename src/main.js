/*
 * @Descripttion: 
 * @version: 
 * @Author: kangguimin
 * @Date: 2020-11-09 16:56:37
 * @LastEditors: kangguimin
 * @LastEditTime: 2020-11-17 18:23:26
 */
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import '../static/css/common.css'
import constant from './constant.js'
import {VueJsonp} from 'vue-jsonp'
iView.Message.config({
  duration: 3
});
Vue.use(iView)
Vue.use(VueJsonp)
// 路由跳转公用方法
Vue.prototype.$goto = function (name, query, params) {
  let last = arguments[arguments.length - 1]
  let delay = typeof last === 'number' ? last : 2
  setTimeout(() => {
    this.$router.push({
      name: name,
      query: query || {},
      params: params || {}
    })
  }, delay)
}
Vue.prototype.staticURL = function (path) {
  if (path) {
    // return  constant.globalData.baseURL + '/source/'+ path
    return  constant.globalData.imgUrl+ path
  }
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
