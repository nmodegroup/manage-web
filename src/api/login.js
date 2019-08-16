import request from '@/libs/service'
import qs from 'qs'
 export function login (data) {
   return request({
    url: '/web/login',
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
   })
 }