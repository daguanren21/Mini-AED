import { createApp } from 'vue'
import './app.scss'
import './assets/font/iconfont.css';
import Taro, { getCurrentInstance, requirePlugin } from '@tarojs/taro'
import { createPinia } from 'pinia'
import { useAuthStore } from './store/auth'
import { wxLogin } from './request/api/login';
const pinia = createPinia()
const plugin = requirePlugin("chatbot");
const parseDeviceSnFromUrl = url => {
  if (!url) {
    return ''
  }
  let parameterStrIndex = url.indexOf("?")
  if (parameterStrIndex == -1) {
    return ''
  }
  let parameterStr = url.substring(parameterStrIndex + 1)
  let parameterArr = parameterStr.split("&")
  if (parameterArr.length <= 0) {
    return ''
  }
  if (parameterArr[0].indexOf('SN=') == -1) {
    return ''
  }
  return (parameterArr[0].split('='))[1]
}
const App = createApp({
  async onLaunch() {


  },
  async onShow() {
    let options = getCurrentInstance().router?.params
    const auth = useAuthStore()
    console.log('设备编号：', options?.q)
    auth.$reset()
    if (options && options.q) {
      const decodedUri = decodeURIComponent(options.q as string);
      let deviceSn = parseDeviceSnFromUrl(decodedUri)
      console.log('设备编号：', deviceSn)
      if (deviceSn) {
        auth.deviceSn = deviceSn
      }
    }
    console.log('切换tab名称', auth.tabName)
    let wxLoginRes = await Taro.login();
    const accountInfo = await Taro.getAccountInfoSync();
    const res = await wxLogin({
      appId: accountInfo.miniProgram.appId,
      code: wxLoginRes.code
    })
    auth.updateAuthInfo(res)
  }
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
App.use(pinia)
export default App
