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
        console.log(res)
    })
  }

export async function uploadImage(params) {
    const ossFileSign = await getOssFileSign(params.formData)
    // const { policy, OSSAccessKeyId, success_action_status, signature, url, key } = ossFileSign
    // let _formData = Object.assign(
    //   params.formData, {
    //     key,
    //     policy,
    //     OSSAccessKeyId,
    //     success_action_status,
    //     signature
    //   })
    // return new Promise((resolve, reject) => {
    //   wx.uploadFile({
    //     url: 'https://oss.nightmodeplus.com',
    //     filePath: params.filePath,
    //     name: 'file',
    //     formData: _formData,
    //     success: res => {
    //       console.log(res)
    //       resolve(key)
    //     },
    //     fail: (err) => {
    //       console.log(err)
    //       reject({ code: -1, msg: '上传失败', data: '' });
    //     }
    //   });
    // });
  }


  