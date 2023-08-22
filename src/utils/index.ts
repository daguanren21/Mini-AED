import Taro from "@tarojs/taro";

type toastIcon = "none" | "success" | "loading"
//提示语
export const showToast = (msg, icon: toastIcon = 'none') => {
  Taro.showToast({
    title: msg,
    icon,
    duration:4000
  })
}
//确认moodal
export const showModal = (content, confirmText = '', fun, showCancel = false) => {
  if (_isEmpty(confirmText)) {
    confirmText = "确定";
  }
  Taro.showModal({
    title: '系统提示',
    content: content,
    showCancel,
    confirmText: confirmText,
    success(res) {
      if (res.confirm) {
        if (fun) {
          fun(false);
        }
      }
    }
  })
}
//判断非空
const _isEmpty = str => {
  if (str === "" || str === '""' || str === "''" || str === null || str === undefined || str === "null" || str === "undefined") {
    return true;
  } else {
    return false;
  }
}
//是否为json
export const isJSON = str => {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('error', e);
      return false;
    }
  }
}
export const wifiErrMsg = (errCode, errMsg?) => {
  var text = "";
  switch (errCode) {
    case 12000:
      text = '未先调用 startWifi 接口';
      break;
    case 12001:
      text = '当前系统不支持相关能力';
      break;
    case 12002:
      text = '密码错误';
      break;
    case 12003:
      text = '连接超时';
      break;
    case 12004:
      text = '重复连接 Wi-Fi';
      break;
    case 12005:
      text = 'Android 特有，未打开 Wi-Fi 开关';
      break;
    case 12006:
      text = 'Android 特有，未打开 GPS 定位开关';
      break;
    case 12007:
      text = '用户拒绝授权链接 Wi-Fi';
      break;
    case 12008:
      text = '无效 SSID';
      break;
    case 12009:
      text = '系统运营商配置拒绝连接 Wi-Fi';
      break;
    case 12010:
      text = '系统其他错误，需要在 errmsg 打印具体的错误原因';
      break;
    case 12011:
      text = '应用在后台无法配置 Wi-Fi';
      break;
    case 12013:
      text = '系统保存的 Wi-Fi 配置过期，建议忘记 Wi-Fi 后重试';
      break;
    default:
      text = errMsg
      break;
  }
  return text;
}

export const parseDeviceSnFromUrl = url => {
  if (!url) {
    return {
      device: '',
      config: ''
    }
  }
  let parameterStrIndex = url.indexOf("?")
  if (parameterStrIndex == -1) {
    return {
      device: '',
      config: ''
    }
  }
  let parameterStr = url.substring(parameterStrIndex + 1)
  let parameterArr = parameterStr.split("&")
  if (parameterArr.length <= 0) {
    return {
      device: '',
      config: ''
    }
  }
  if (parameterArr.length === 1) {
    if (parameterArr[0].indexOf('SN=') == -1) {
      return {
        device: '',
        config: ''
      }
    } else {
      return {
        device: (parameterArr[0].split('='))[1],
        config: ''
      }
    }
  }
  if (parameterArr.length >= 2) {
    if (parameterArr[0].indexOf('SN=') == -1 && parameterArr[1].indexOf('CONFIG=') !== -1) {
      return {
        device: '',
        config: (parameterArr[1].split('='))[1]
      }
    }
    if (parameterArr[0].indexOf('SN=') !== -1 && parameterArr[1].indexOf('CONFIG=') === -1) {
      return {
        device: (parameterArr[0].split('='))[1],
        config: ''
      }
    }
    if (parameterArr[0].indexOf('SN=') === -1 && parameterArr[1].indexOf('CONFIG=') === -1) {
      return {
        device: '',
        config: ''
      }
    }
    return {
      device: (parameterArr[0].split('='))[1],
      config: (parameterArr[1].split('='))[1]
    }
  }
  return {
    device: '',
    config: ''
  }
}