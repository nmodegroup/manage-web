import request from '@/libs/service'
import requestParams from '@/libs/requestParams';
export function get_account_list (data) {
  return request({
  url: '/web/consumer/list' + requestParams.generateParams(data),
  method: 'get',
  headers: {
    'Content-type': 'application/json'
  },
  data
  })
}

export function get_place_list (data) {
  return request({
  url: '/web/consumer/tableOrder' + requestParams.generateParams(data),
  method: 'get',
  headers: {
    'Content-type': 'application/json'
  },
  data
  })
}