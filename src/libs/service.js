import {
  Message,
  Modal
} from 'iview'
import axios from 'axios'
import router from '@/router'
import constant from '../constant.js'
const service = axios.create({
  baseURL: constant.globalData.baseURL, //测试环境接口
  //baseURL: 'https://www.nightmodeplus.com',  //生产环境的接口
  timeout: 200000
})

service.interceptors.request.use(config => {
  var TOKEN = localStorage.getItem("token") || ''
  if (TOKEN) {
      config.headers.token = TOKEN;
  }
  return config;
}, error => {
  Promise.reject(error);
})
service.interceptors.response.use(
  response => {
      const res = response.data;
      if (res.code == 1000) {
          return Promise.resolve(response.data);
      } else if (res.code == 1002) {
          Modal.error({
              title: '提示',
              content: res.msg,
              onOk: () => {
                router.push({name: 'login'})
              }
          })
      } else {
          messageError(res.msg);
          return Promise.reject(res);
      }
  },
  error => {
      messageError(error.message);
      return Promise.reject(error);
  })
function messageError (msg) {
  if (!msg || msg === 'Network Error') {
      Message.error('服务器开小差了');
  } else {
      Message.error(msg)
  }
}
export default service
