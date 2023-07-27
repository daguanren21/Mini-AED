export default defineAppConfig({
  pages: [
    'pages/guide/index',
    'pages/mini-advice/index',
    'pages/mini-center/index',
    'pages/feed-back/index',
    'pages/systemInfo/index',
    'pages/guide-detail/index',

  ],
  "plugins": {
    "chatbot": {
      "version": "1.3.7",
      "provider": "wx8c631f7e9f2465e1",
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
        pagePath: 'pages/guide/index',
        text: '操作指南'
      },
      {
        pagePath: 'pages/mini-advice/index',
        text: '问题咨询'
      },
      {
        pagePath: 'pages/mini-center/index',
        text: '个人中心'
      }
    ]
  }
})
