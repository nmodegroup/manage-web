/*
 * @Descripttion: 
 * @version: 
 * @Author: kangguimin
 * @Date: 2020-11-17 14:52:57
 * @LastEditors: kangguimin
 * @LastEditTime: 2020-11-17 18:02:02
 */
import request from '@/libs/service'
import requestParams from '@/libs/requestParams';
import qs from 'qs'

export function get_homePage (data) {//oss文件上传获取签名
  return request({
    url: '/web/consumer/homePage' + requestParams.generateParams(data),
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    }
  })
}

export function get_city_all (data) {
    return request({
      url: '/common/city/all' + requestParams.generateParams(data),
      method: 'get',
      headers: {
        'Content-type': 'application/json'
      }
    }).then(res => {
        const data = res.data
        const list = []
        Object.keys(data.province_list).map( key => {
            list.push({
                id: String(key),
                name: data.province_list[key]
            })
        })
        return list
    })
}

export function get_city_list (data) {
    return request({
      url: '/common/city/list' + requestParams.generateParams(data),
      method: 'get',
      headers: {
        'Content-type': 'application/json'
      }
    }).then(res => {
        const data = res.data
        const list = []
        data.map( item => {
            list.push({
                id: String(item.id),
                name: item.name
            })
        })
        return list
    })
}

export function get_city_district (data) {
    return request({
      url: '/common/city/area' + requestParams.generateParams(data),
      method: 'get',
      headers: {
        'Content-type': 'application/json'
      }
    }).then(res => {
        const data = res.data
        const list = []
        data.map( item => {
            list.push({
                id: String(item.id),
                name: item.name
            })
        })
        return list
    })
}

export function getOssFileSign (data) {//oss文件上传获取签名
    return request({
      url: '/common/file/sign' + requestParams.generateParams(data),
      method: 'get',
      headers: {
        'Content-type': 'application/json'
      }
    }).then( res => {
       return res.data
    })
  }

export function uploadImage (data) {
  return request({
  url: 'https://oss.nightmodeplus.com',
  method: 'post',
  headers: {
    'Content-type': 'multipart/form-data'
  },
  data
  }).then( res => {
  })
}

// export function getGeolocation (data) {
//   return request({
//     url: 'https://apis.map.qq.com/ws/geocoder/v1/' + requestParams.generateParams(data),
//     method: 'get',
//     headers: {
//       'Content-type': 'application/json'
//     }
//   }).then( res => {
//      console.log(res)
//   })
// }