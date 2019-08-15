import {
  Message,
  Modal
} from 'iview';
import axios from 'axios';
import Util from '@/libs/util.js';
const service = axios.create({
  baseURL: 'http://192.168.0.111:808/api/v1/', //测试环境接口
  //baseURL: 'https://console.benpaobao.com/api/v1/',  //生产环境的接口
  timeout: 200000
});

service.interceptors.request.use(config => {
  var TOKEN = Cookies.get('TOKEN');
  if (TOKEN) {
      config.headers.token = TOKEN;
  }
  return config;
}, error => {
  Promise.reject(error);
});

service.interceptors.response.use(
  response => {
      const res = response.data;
      if (res.code == 2000) {
          messageError(res.msg);
      // throw new Error(res)
          return Promise.reject(res);
      } else if (res.code == 1000) {
          return Promise.resolve(response.data);
      } else if (res.code == 3000) {
          Modal.error({
              title: '提示',
              content: res.msg,
              onOk: () => {
                //退出登录
                Util.logout(window.vm);
              }
          });
      } else if (res.code == 4000) {
          messageError(res.msg);
          return Promise.reject(res);
      } else {
          messageError(res.msg);
          return Promise.reject(res);
      }
  },
  error => {
      messageError(error.message);
      return Promise.reject(error);
  });

function messageError (msg) {
  if (!msg || msg === 'Network Error') {
      Message.error('服务器开小差了');
  } else {
      Message.error(msg);
  }
}

export default service;
