import { createApp } from 'vue'
import './app.scss'
import './assets/font/iconfont.css';
import Taro, { requirePlugin } from '@tarojs/taro'
import { createPinia } from 'pinia'
import { useAuthStore } from './store/auth'
import { wxLogin } from './request/api/login';
const pinia = createPinia()
const plugin = requirePlugin("chatbot");
const App = createApp({
  async onLaunch() {
    const auth = useAuthStore()
    let wxLoginRes = await Taro.login();
    const accountInfo = await Taro.getAccountInfoSync();
    const res = await wxLogin({
      appId: accountInfo.miniProgram.appId,
      code: wxLoginRes.code
    })
    auth.updateAuthInfo(res)
    if(res.openid){
      plugin.init({
        appid: accountInfo.miniProgram.appId, //微信对话开放平台小程序插件appid
        openid: res.openid, // 小程序用户的openid，必填项
        welcome: "",
        background: "#eee",
        guideList: ['AED使用', 'AED安装'],
        guideCardHeight: 50,
        operateCardHeight: 42,
        history: false,
        historySize: 0,
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
