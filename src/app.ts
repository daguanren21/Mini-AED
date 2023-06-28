import { createApp } from 'vue'
import './app.scss'
import './assets/font/iconfont.css';
import Taro, { requirePlugin } from '@tarojs/taro'
import { createPinia } from 'pinia'
import { useAuthStore } from './store/auth'
const plugin = requirePlugin("chatbot");
const pinia = createPinia()
plugin.init({
  appid: "U6gQND4LC750OBNab9HdMFdfd3PSMt", //微信对话开放平台小程序插件appid
  openid: "oFQk65FRPFqAt9lbP0W5iH_20nbg", // 小程序用户的openid，必填项
  welcome: "请问需要什么帮助",
  // background: "#eee",  
  guideList: [],
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
  fail: (error) => { },
});
const App = createApp({
  onLoad(){
  },
  async onLaunch(options) {
    const auth = useAuthStore()
    let wxLoginRes = await Taro.login();
    const accountInfo = await Taro.getAccountInfoSync();
    console.log(wxLoginRes.code)
    // const serverLoginRes = await Taro.request({
    //   url: 'https://demo.jousing.cn/api/v1/authenticate/mini-program/wx',
    //   method: 'POST',
    //   data: {
    //     appId: accountInfo.miniProgram.appId,
    //     code: wxLoginRes.code
    //   }
    // })
   
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
App.use(pinia)
export default App
