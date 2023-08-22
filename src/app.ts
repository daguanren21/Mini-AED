import { createApp } from 'vue'
import './app.scss'
import './assets/font/iconfont.css';
import Taro, { getCurrentInstance, requirePlugin } from '@tarojs/taro'
import { createPinia } from 'pinia'
import { useAuthStore } from './store/auth'
import { wxLogin } from './request/api/login';
import { parseDeviceSnFromUrl } from './utils';
const pinia = createPinia()
const plugin = requirePlugin("chatbot");

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
      let params = parseDeviceSnFromUrl(decodedUri)
      console.log('设备编号：', params.device, params.config)
      if (params.device) {
        auth.deviceSn = params.device
      }
      if (params.config) {
        auth.config = params.config
      }
    }
    console.log('切换tab名称', auth.tabName)
    Taro.showLoading({ title: '数据加载中', mask: true })
    let wxLoginRes = await Taro.login();
    const accountInfo = await Taro.getAccountInfoSync();
    const res = await wxLogin({
      appId: accountInfo.miniProgram.appId,
      code: wxLoginRes.code
    })
    auth.updateAuthInfo(res)
    Taro.hideLoading()
  }
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
App.use(pinia)
export default App


