import request from '@/libs/service'
import requestParams from '@/libs/requestParams';
import qs from 'qs'
export function get_homePage (data) {//获取用户端小程序首页信息
  return request({
    url: '/web/consumer/homePage' + requestParams.generateParams(data),
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    }
  })
}

export function get_mch_list (data) {//获取商铺列表
  return request({
    url: '/web/merchant/all' + requestParams.generateParams(data),
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    }
  })
}

export function get_activity_list (data) {//获取活动列表
  return request({
    url: '/web/activity/all' + requestParams.generateParams(data),
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    }
  })
}

export function update_banner (data) {//新增/编辑首页banner
  return request({
    url: '/web/consumer/banner',
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
  })
}

export function update_bar (data) {////新增/编辑首页banner
  return request({
    url: '/web/consumer/bar',
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
  })
}

export function get_mch_info (data) {//根据商铺id获取商铺信息
  return request({
    url: '/web/merchant/info' + requestParams.generateParams(data),
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    }
  })
}

export function del_banner (data) {//删除banner信息
  return request({
    url: '/web/consumer/banner' + requestParams.generateParams(data),
    method: 'delete',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function del_bar (data) {//删除人气酒吧信息
  return request({
    url: '/web/consumer/bar' + requestParams.generateParams(data),
    method: 'delete',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function toggle_banner (data) {//开启/关闭banner展示
  return request({
    url: '/web/consumer/banner' + requestParams.generateParams(data),
    method: 'put',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function toggle_bar (data) {//开启/关闭人气酒吧展示
  return request({
    url: '/web/consumer/bar' + requestParams.generateParams(data),
    method: 'put',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}
