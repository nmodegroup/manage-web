import request from '@/libs/service'
import requestParams from '@/libs/requestParams';
export function get_account_list (data) {//商家管理获取账号列表
  return request({
  url: '/web/merchant/list' + requestParams.generateParams(data),
  method: 'get',
  headers: {
    'Content-type': 'application/json'
  }
  })
}

export function on_switch (data) {//账号管理启用禁用
  return request({
  url: '/web/merchant/switch' + requestParams.generateParams(data),
  method: 'put',
  headers: {
    'Content-type': 'application/x-www-form-urlencoded'
  }
  })
}

export function get_auth_list (data) {//获取商铺列表
  return request({
  url: '/web/merchant/auth' + requestParams.generateParams(data),
  method: 'get',
  headers: {
    'Content-type': 'application/json'
  }
  })
}

export function merchant_audit (data) {//商家认证信息审核
  return request({
  url: '/web/merchant/audit' + requestParams.generateParams(data),
  method: 'put',
  headers: {
    'Content-type': 'application/x-www-form-urlencoded'
  }
  })
}

export function get_activity_list (data) {//获取活动管理列表
  return request({
  url: '/web/merchant/activity' + requestParams.generateParams(data),
  method: 'get',
  headers: {
    'Content-type': 'application/json'
  }
  })
}

export function merchant_activity_audit (data) {//活动审核
  return request({
  url: '/web/merchant/activity/audit' + requestParams.generateParams(data),
  method: 'put',
  headers: {
    'Content-type': 'application/x-www-form-urlencoded'
  }
  })
}

export function get_table_list (data) {//获取桌位列表
  return request({
  url: '/web/merchant/table/list' + requestParams.generateParams(data),
  method: 'get',
  headers: {
    'Content-type': 'application/json'
  }
  })
}