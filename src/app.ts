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
    const auth = useAuthStore()
    let options = getCurrentInstance().router?.params
    console.log('设备编号：',options.q)
    if (options && options.q) {
      const decodedUri = decodeURIComponent(options.q as string);
      let deviceSn = parseDeviceSnFromUrl(decodedUri)
      console.log('设备编号：',deviceSn)
      if (deviceSn) {
        auth.deviceSn = deviceSn
      }
    }
    let wxLoginRes = await Taro.login();
    const accountInfo = await Taro.getAccountInfoSync();
    const res = await wxLogin({
      appId: accountInfo.miniProgram.appId,
      code: wxLoginRes.code
    })
    auth.updateAuthInfo(res)
    if (res.openid) {
      plugin.init({
        appid: "U6gQND4LC750OBNab9HdMFdfd3PSMt", //微信对话开放平台小程序插件appid
        openid: res.openid, // 小程序用户的openid，必填项
        welcome: "",
        background: "#eee",
        guideList: ['AED使用', 'AED安装'],
        guideCardHeight: 50,
        operateCardHeight: 42,
        navHeight: 88, // 自定义导航栏高度
        robotHeader:
          "https://res.wx.qq.com/mmspraiweb_node/dist/static/miniprogrampageImages/talk/leftHeader.png",
        userHeader:
          "https://res.wx.qq.com/mmspraiweb_node/dist/static/miniprogrampageImages/talk/rightHeader.png",
        userName: "",
        success: () => {
        },
        fail: () => { },
      });
    }

  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
App.use(pinia)
export default App
