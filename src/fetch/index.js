import axios from 'axios';
import store from '../store/index.js'
import host from './host';
import { Loading,Message} from 'element-ui';
axios.defaults.baseURL = host.hostIp;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.withCredentials = true;
let loadingInstance = null;
const downloadUrl = res => {
  var blob = new Blob([res.data],{type: res.headers['content-type']});
  var downloadElement = document.createElement('a');
  var href = window.URL.createObjectURL(blob);
  downloadElement.href = href;
  downloadElement.download = 'xxxx.xlsx';
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(href);
}
axios.interceptors.request.use(config => {
    var authorization = store.state.authorization;
    if (authorization) {
      config.headers.authorization = authorization;
    }
    return config;
  }, err => {
    return Promise.reject(err);
});

// http response
axios.interceptors.response.use(
  response => {
    if(response.headers['content-type']=== 'application/octet-stream' || response.headers['content-type']=== 'application/vnd.ms-excel'){
      downloadUrl(response);
      return;
    }
    return response;
  },
  error => {
    return Promise.reject(error)   // 返回接口返回的错误信息
});

function doGet(url, params) {
    return new Promise(function(resolve, reject) {
        var str = "";
        if(typeof params == 'object')
          str = Object.values(params).join("/");
        else
          str = params ? params : "";

        var u = str ? url + "/" + str : url +"?dataString="+(new Date()).getTime();
        axios.get(u,null,{
          validateStatus: function (status) {
            return status; // default
          }
        }).then((response) => {
          var r = response.data;
          if(r.hasOwnProperty('returnCode') && r.returnCode !=='1'){
            Message.warning({
              message:r.returnMsg
            });
          }
          resolve(r);
        }).catch((error) => {
          reject(error);
        })
    });
}
function doPost(url, params,isLoading) {
    if(isLoading && !loadingInstance)
      loadingInstance  = Loading.service({target:'.a-product',lock: true,text: '努力加载中',spinner: 'el-icon-loading',background: 'rgba(231, 231, 231, .6)'});
    return new Promise(function(resolve, reject) {
        axios.post(url, params, {
          validateStatus: function (status) {
            return status; // default
          }
        }).then((response) => {
          loadingInstance && loadingInstance.close();
          var r = response.data;
          if(r.hasOwnProperty('returnCode') && r.returnCode !=='1'){
            Message.warning({
              message:r.returnMsg
            });
          }
          resolve(r);
        }).catch((error) => {
          loadingInstance && loadingInstance.close();
          reject(error);
        });
    })
}
function getBaseUrl() {
  return axios.defaults.baseURL;
}

export default {
  doGet:doGet,
  doPost:doPost,
  getBaseUrl() {
    return getBaseUrl();
  },
  //获取验证码
  getCaptchaUrl() {
    var url = getBaseUrl() + "/system/images/checkCode" +"?dataString="+(new Date()).getTime();
    return new Promise(function(resolve, reject){
      axios.get(url, {
        responseType: 'arraybuffer'
      }).then(response => {
        var sBase64 = 'data:image/png;base64,' + btoa(
            new Uint8Array(response.data)
              .reduce((data, byte) => data + String.fromCharCode(byte), ''));
        resolve(sBase64);
      }).then(data => {
        reject("");
      })
    })
  }
}
