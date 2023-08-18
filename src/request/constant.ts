const enum Server {
    DEVELOPMENT = 'https://demo.jousing.cn/api',
    LOCAL = 'http://192.168.10.91:9090/api',
    PRODUCTION = 'https://www.jousing.cn/api'
  }
  export const baseUrl = Server.DEVELOPMENT

  export const softApConfig = {
    sendVerurl: 'http://192.168.4.1:80/proto-ver',
    sendScanWifiurl: 'http://192.168.4.1:80/prov-scan',
    sendSessionurl: 'http://192.168.4.1:80/prov-session',
    sendWiFiConfigurl: 'http://192.168.4.1:80/prov-config',
    sendCustomData: 'http://192.168.4.1:80/custom-data',
    name: 'PROV_',
    lam: 'LAM',
    cam: 'CAM',
  }