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

export function get_cover (data) {//获取封面图
  return request({
    url: '/web/merchant/cover' + requestParams.generateParams(data),
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    }
  })
}

export function get_bartender (data) {//获取调酒师
  return request({
    url: '/web/merchant/bartender' + requestParams.generateParams(data),
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

export function get_table_info (data) {//获取桌位图
  return request({
    url: '/web/merchant/table/info' + requestParams.generateParams(data),
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    }
  })
}

export function  modification_default_rate(data) {//修改默认比例
  return request({
    url: '/web/default/rate' + requestParams.generateParams(data),
    method: 'put',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function  modification_manual_rate(data) {//修改单个店铺比例
  return request({
    url: '/web/bar/rate' + requestParams.generateParams(data),
    method: 'put',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function get_default_rate (data) {//获取店铺默认比例
  return request({
    url: '/web/default/rate' + requestParams.generateParams(data),
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    }
  })
}

export function post_restore_rate (data) {//还原店铺比例
  return request({
    url: '/web/bar/rate' + requestParams.generateParams(data),
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function get_extract_record (data) {//获取店铺默认比例
  return request({
    url: '/web/extract/page' + requestParams.generateParams(data),
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    }
  })
}

export function  audit_extract_state(data) {//修改单个店铺比例
  return request({
    url: '/web/extract/audit' + requestParams.generateParams(data),
    method: 'put',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function get_rate_record (data) {//获取店铺修改比例记录
  return request({
    url: '/web/bar/rates' + requestParams.generateParams(data),
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    }
  })
}

export function get_default_rate_record (data) {//获取店铺修改比例记录
  return request({
    url: '/web/default/rates' + requestParams.generateParams(data),
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    }
  })
}

export function get_code_back (data) {//获取店铺修改比例记录
  return request({
    url: '/web/codeback/list' + requestParams.generateParams(data),
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    }
  })
}

export function  audit_code_back(data) {//背景审核
  return request({
    url: '/web/codeback/audit' + requestParams.generateParams(data),
    method: 'put',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function get_mch_shops (data) {//获取店铺列表
  return request({
    url: '/web/merchant/activity/shops' + requestParams.generateParams(data),
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    }
  }).then( res => {
    const data = res.data
    const list = [];
    data.map( item => {
      list.push({
        id: String(item.id),
        name: item.name
      })
    })
    return list
  })
}

export function post_update_activity (data) {//增/编辑活动
  return request({
    url: '/web/merchant/activity' + requestParams.generateParams(data),
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function get_mch_shops_detail (data) {//获取店铺列表
  return request({
    url: '/web/merchant/activity/' + data.actId + requestParams.generateParams(data),
    method: 'get',
    headers: {
      'Content-type': 'application/json'
    }
  }).then( res => {
    const data = res.data
    return {
      mchId: String(data.mid),
      theme: data.theme,
      date: [data.beginTime, data.endTime],
      provinceId: "",
      cityId: String(data.cityId),
      districtId: String(data.areaId),
      address: data.address,
      phone: data.phone,
      guest: data.guest,
      costType: String(data.isCharge),
      ticketPrice: "",
      reservation: String(data.quotaType),
      quotasNum: "",
      banner: data.banner,
      poster: data.post
    }
  })
}
