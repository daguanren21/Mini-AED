export default defineAppConfig({
  pages: [
    'pages/advice/index',
    'pages/guide/index',
    'pages/center/index',
    'pages/guide-detail/index',
    'pages/systemInfo/index',
    'pages/feed-back/index'
  ],
  "plugins": {
    "chatbot": {
      "version": "1.3.7",
      "provider": "wx8c631f7e9f2465e1"
    }
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: true,
    color: '#000000',
    selectedColor: '#DC143C',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/advice/index',
        text: '问题咨询'
      },
      {
        pagePath: 'pages/guide/index',
        text: '操作指南'
      }, {
        pagePath: 'pages/center/index',
        text: '个人中心'
      }
    ]
  }
})
