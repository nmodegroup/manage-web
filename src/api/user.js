import request from '@/libs/service'
import requestParams from '@/libs/requestParams';
export function get_account_list (data) {//获取用户账号
  return request({
  url: '/web/consumer/list' + requestParams.generateParams(data),
  method: 'get',
  headers: {
    'Content-type': 'application/json'
  }
  })
}

export function get_place_list (data) {//获取桌位预订列表
  return request({
  url: '/web/consumer/tableOrder' + requestParams.generateParams(data),
  method: 'get',
  headers: {
    'Content-type': 'application/json'
  }
  })
}

export function get_remind_list (data) {//获取桌位排位列表
  return request({
  url: '/web/consumer/remind' + requestParams.generateParams(data),
  method: 'get',
  headers: {
    'Content-type': 'application/json'
  }
  })
}

export function get_activity_list (data) {//获取活动预订列表
  return request({
  url: '/web/consumer/activity' + requestParams.generateParams(data),
  method: 'get',
  headers: {
    'Content-type': 'application/json'
  }
  })
}