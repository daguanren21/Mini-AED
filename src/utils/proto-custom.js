const aesjs = require('../commonjs/aes.js');
const Sha256 = require('../commonjs/sha256.js');
const curve25519 = require('../commonjs/curve25519-js.js'); // 引入椭圆加密
const protobuf = require('../weichatPb/protobuf.js'); //引入protobuf模块
const sessionProto = require('../proto/session.js');
const wifiScanProto = require('../proto/wifi_scan.js');
const wifiConfigProto = require('../proto/wifi_config.js');
import {
  softApConfig
} from '../request/constant'
const Taro = require('@tarojs/taro');
let aesCtr = "";
const request = (self, url, buffer, fun, title) => {
  console.log(url);
  Taro.request({
    url: url,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded', // 默认值
    },
    responseType: 'arraybuffer',
    data: buffer,
    success(res) {
      console.log("238:", res)
      if (fun) {
        fun(self, res.data)
      }
    },
    fail(res) {
      console.log("250:", res);
      Taro.hideLoading();
      showModel("配网提示", title, false);
    }
  })
}
// 获取版本、是否加密等信息
const getSessionVer = (self, fun) => {
  Taro.request({
    url: softApConfig.sendVerurl,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded', // 默认值
    },
    data: 'none',
    success(res) {
      console.log("65:", res)
      let data = res.data;
      let flag = false;
      if (data.prov.cap.indexOf('no_sec') == -1) {
        flag = true;
      }
      self.isSec = flag
      if (fun) {
        fun();
      }
    },
    fail(res) {
      Taro.hideLoading();
    }
  })
}
const sendCustomData = (data, fun) => {
  Taro.request({
    url: softApConfig.sendCustomData,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded', // 默认值
    },
    data: data,
    success(res) {
      console.log("65:", res)
      if (fun) {
        fun(res)
      }
    },
    fail(res) {
      Taro.hideLoading();
    }
  })
}
const protoSession = (self) => {
  console.log('protoSession', self);
  let sessionRoot = protobuf.Root.fromJSON(sessionProto);
  let SessionData = sessionRoot.lookupType("SessionData"); //SessionData
  let payload = {};
  if (!self.isSec) {
    let sec0 = require('../proto/sec0.js');
    let sec0Root = protobuf.Root.fromJSON(sec0);
    let Sec0Payload = sec0Root.lookupType("Sec0Payload"); //Sec0Payload
    let S0SessionCmd = sec0Root.lookupType("S0SessionCmd"); //Sec0Payload
    let sessionCmd = {}
    sessionCmd = S0SessionCmd.create(sessionCmd);
    let secObj = {
      sc: sessionCmd
    }
    secObj = Sec0Payload.create(secObj);
    payload.sec0 = secObj;
  } else {
    let key = curve25519.generateKeyPair(new Uint8Array(rand()));
    self.clientKey = key
    let sec1 = require('../proto/sec1.js');
    let sec1Root = protobuf.Root.fromJSON(sec1);
    let Sec1Payload = sec1Root.lookupType("Sec1Payload"); //Sec1Payload
    let SessionCmd0 = sec1Root.lookupType("SessionCmd0"); //SessionCmd1
    let sessionCmd = {
      clientPubkey: key.public
    };
    sessionCmd = SessionCmd0.create(sessionCmd);
    let sec0bj = {
      sc0: sessionCmd
    };
    sec0bj = Sec1Payload.create(sec0bj);
    payload.secVer = 1;
    payload.sec1 = sec0bj;
  }
  payload = SessionData.create(payload);
  console.log("56", payload);
  let buffer = SessionData.encode(payload).finish();
  return toBuffer(buffer);
}
const protobufSec1 = (self) => {
  let sessionRoot = protobuf.Root.fromJSON(sessionProto);
  let SessionData = sessionRoot.lookupType("SessionData")
  let Sec1Payload = SessionData.lookupType("Sec1Payload"); //Sec1Payload
  let SessionCmd1 = SessionData.lookupType("SessionCmd1"); //SessionCmd1
  console.log("private", self.clientKey.private);
  console.log("devicePubkey", self.sessionResp0.sec1.sr0.devicePubkey);
  console.log("pop", self.pop);
  let secretKey = curve25519.sharedKey(self.clientKey.private, self.sessionResp0.sec1.sr0.devicePubkey);
  if (!_isEmpty(self.pop)) {
    let v2 = new Uint8Array(Sha256.arrayBuffer(self.pop));
    const secret = new Uint8Array(32);
    for (let i = 0; i < 32; ++i) {
      secret[i] = secretKey[i] ^ v2[i];
    }
    secretKey = secret;
  }

  self.secretKey = secretKey
  let devRand = new Uint8Array(self.sessionResp0.sec1.sr0.deviceRandom)
  aesCtr = new aesjs.ModeOfOperation.ctr(secretKey, new aesjs.Counter(devRand));
  let clientVerifyData = aesCtr.encrypt(self.sessionResp0.sec1.sr0.devicePubkey);
  let sessionCmd = {
    clientVerifyData: clientVerifyData
  };
  sessionCmd = SessionCmd1.create(sessionCmd);
  let sec1bj = {
    msg: 2,
    sc1: sessionCmd
  };
  sec1bj = Sec1Payload.create(sec1bj);
  let payload = {};
  payload.secVer = 1;
  payload.sec1 = sec1bj;
  payload = SessionData.create(payload);
  console.log("336", payload);
  let buffer = SessionData.encode(payload).finish();
  return toBuffer(buffer);
}
// 发送WiFi信息
const wifiConfig = (self) => {
  let wifiConfigRoot = protobuf.Root.fromJSON(wifiConfigProto);
  let wiFiConfigPayload = wifiConfigRoot.lookupType("WiFiConfigPayload");

  let cmdSetConfig = wifiConfigRoot.lookupType("CmdSetConfig");
  let cmdPayload = {};
  cmdPayload.ssid = self.currentWifi.SSID;
  cmdPayload.passphrase = self.currentWifi.password;
  cmdPayload = cmdSetConfig.create(cmdPayload);
  let payload = {};
  payload.msg = 2;
  payload.cmdSetConfig = cmdPayload
  payload = wiFiConfigPayload.create(payload);
  console.log(payload);
  let buffer = wiFiConfigPayload.encode(payload).finish();
  if (self.isSec) {
    buffer = aesCtr.encrypt(buffer);
  }
  return toBuffer(buffer);
}
// 告知设备发送的凭据连接至 AP
const applyWifiConfig = (self) => {
  let wifiConfigRoot = protobuf.Root.fromJSON(wifiConfigProto);
  let wiFiConfigPayload = wifiConfigRoot.lookupType("WiFiConfigPayload");
  let payload = {};
  payload.msg = 4;
  payload = wiFiConfigPayload.create(payload);
  let buffer = wiFiConfigPayload.encode(payload).finish();
  if (self.isSec) {
    buffer = aesCtr.encrypt(buffer);
  }
  return toBuffer(buffer);
}
const getApplyStatus = (self) => {
  let wifiConfigRoot = protobuf.Root.fromJSON(wifiConfigProto);
  let cmdGetStatusPayload = wifiConfigRoot.lookupType("CmdGetStatus");
  let wiFiConfigPayload = wifiConfigRoot.lookupType("WiFiConfigPayload");
  let cmdGetStatus = {};
  cmdGetStatus = cmdGetStatusPayload.create(cmdGetStatus);
  let payload = {};
  payload.cmdGetStatus = cmdGetStatus;
  payload = wiFiConfigPayload.create(payload);
  console.log(payload)
  let buffer = wiFiConfigPayload.encode(payload).finish();
  if (self.isSec) {
    buffer = aesCtr.encrypt(buffer);
  }
  return toBuffer(buffer);
}
// 解析第一次返回（若加密则有第二次返回）
const decodeSessionResp0 = (self, data) => {
  try {
    let sessionRoot = protobuf.Root.fromJSON(sessionProto);
    let sessionData = sessionRoot.lookupType("SessionData");
    self.sessionResp0 = sessionData.decode(data)
    console.log("358", sessionData.decode(data));
    // Taro.hideLoading();
    if (self.isSec) {
      self.sendSessionData(protobufSec1(self), decodeSessionResp1);
    } else {
      self.sendWiFiConfig(wifiConfig(self), decodeWiFiConfig);
    }
  } catch (res) {
    Taro.hideLoading();
    showModel("配网提示", "设备配网失败", false);
  }
}
// 解析加密第二次返回
const decodeSessionResp1 = (self, data) => {
  try {
    let sessionRoot = protobuf.Root.fromJSON(sessionProto);
    let sessionData = sessionRoot.lookupType("SessionData");

    self.sessionResp1 = sessionData.decode(data)
    check(self);
  } catch (res) {
    Taro.hideLoading();
    console.log(res);
    showModel("配网提示", "设备配网失败", false);
  }
}

// 解析ssid和password返回
const decodeWiFiConfig = (self, data) => {
  try {
    let wifiConfigRoot = protobuf.Root.fromJSON(wifiConfigProto);
    let wiFiConfigPayload = wifiConfigRoot.lookupType("WiFiConfigPayload");
    if (self.isSec) {
      data = aesCtr.decrypt(new Uint8Array(data));
    }
    data = wiFiConfigPayload.decode(data);
    console.log(data);
    if (data.msg && data.msg == 3) {
      self.sendWiFiConfig(applyWifiConfig(self), decodeWiFiConfig);
    } else if (data.msg && data.msg == 5) {
      setTimeout(() => {
        self.sendWiFiConfig(getApplyStatus(self), decodeWiFiStatus);
      }, 1000)
    }
  } catch (res) {
    Taro.hideLoading();
    console.log(res);
    showModel("配网提示", "设备配网失败", false);
  }
}
// 解析查询连接结果
const decodeWiFiStatus = (self, data) => {
  try {
    let wifiConfigRoot = protobuf.Root.fromJSON(wifiConfigProto);
    let wiFiConfigPayload = wifiConfigRoot.lookupType("WiFiConfigPayload");
    if (self.isSec) {
      data = aesCtr.decrypt(new Uint8Array(data));
    }
    data = wiFiConfigPayload.decode(data);
    console.log(data);
    let status = data.respGetStatus.staState
    if (status == 0) {
      wifiConfigSuc(self);
    } else if (status == 1) {
      setTimeout(() => {
        self.sendWiFiConfig(getApplyStatus(self), decodeWiFiStatus);
      }, 1000)
    } else if (status == 2) {
      showModel("配网提示", "设备配网失败, 连接断开", false);
    } else if (status == 3) {
      let failReason = data.respGetStatus.failReason
      if (failReason == 0) {
        showModel("配网提示", "设备配网失败, 路由密码错误", false);
      } else if (failReason == 1) {
        showModel("配网提示", "设备配网失败, 没有发现对应路由", false);
      } else {
        showModel("配网提示", "设备配网失败", false);
      }
    }
  } catch (res) {
    Taro.hideLoading();
    console.log(res);
    showModel("配网提示", "设备配网失败", false);
  }
}
// 配网成功
const wifiConfigSuc = (self) => {
  setWifiStorage(self.currentWifi.SSID, self.currentWifi.password);
  Taro.hideLoading();
  showIconToast("设备配网成功", "success");
  setTimeout(() => {
    Taro.navigateTo({
      url: "/pages/wifiConfig/index",
    });
  }, 1000);
  // setTimeout(() => {
  //   Taro.reLaunch({
  //     url: '/pages/index/index',
  //   })
  //   Taro.offWifiConnected();
  // }, 2000)
  // // 加延时防止WiFi频繁切换报12010错误（特别是IOS）
  // if (app.globalData.platform == 'ios') {
  //   setTimeout(() => {
  //     showLoading("手机连接WiFi中...");
  //   }, 1000)
  //   setTimeout(() => {
  //     self.startConnectMobileWifi();
  //   }, 2000)
  // } else {
  //   setTimeout(() => {
  //     self.startConnectMobileWifi();
  //   }, 1000)
  // }
}
// 加密验证
const check = (self) => {
  let decryptedBytes = aesCtr.decrypt(self.sessionResp1.sec1.sr1.deviceVerifyData);
  if (JSON.stringify(decryptedBytes) == JSON.stringify(self.clientKey.public)) {
    self.sendWiFiConfig(wifiConfig(self), decodeWiFiConfig);
  } else {
    Taro.hideLoading();
    showModel("配网提示", "设备配网失败", false);
  }
}
const wifiScanReq = (self) => {
  let wifiScanRoot = protobuf.Root.fromJSON(wifiScanProto);
  let wifiScanStartPayload = wifiScanRoot.lookupType("CmdScanStart");
  let wifiScanPayload = wifiScanRoot.lookupType("WiFiScanPayload");
  let wifiScanStart = {
    blocking: true,
    groupChannels: 5,
    periodMs: 120
  }
  wifiScanStart = wifiScanStartPayload.create(wifiScanStart);
  let payload = {};
  payload.cmdScanStart = wifiScanStart;
  payload = wifiScanPayload.create(payload);
  console.log(payload);
  let buffer = wifiScanPayload.encode(payload).finish();
  console.log(buffer);
  if (self.isSec) {
    buffer = aesCtr.encrypt(buffer);
  }
  return toBuffer(buffer);
}
const wifiScanReq1 = (self) => {
  let wifiScanRoot = protobuf.Root.fromJSON(wifiScanProto);
  let wifiScanPayload = wifiScanRoot.lookupType("WiFiScanPayload");
  let payload = {};
  payload.msg = 2;
  payload = wifiScanPayload.create(payload);
  console.log(payload);
  let buffer = wifiScanPayload.encode(payload).finish();
  console.log(buffer);
  if (self.isSec) {
    buffer = aesCtr.encrypt(buffer);
  }
  return toBuffer(buffer);
}
const wifiScanReq2 = (self, count) => {
  let wifiScanRoot = protobuf.Root.fromJSON(wifiScanProto);
  let cmdScanResultPayload = wifiScanRoot.lookupType("CmdScanResult");
  let wifiScanPayload = wifiScanRoot.lookupType("WiFiScanPayload");
  let cmdScanResult = {
    count: count
  };
  cmdScanResult = cmdScanResultPayload.create(cmdScanResult);
  let payload = {};
  payload.msg = 4;
  payload.cmdScanResult = cmdScanResult
  payload = wifiScanPayload.create(payload);
  console.log(payload);
  let buffer = wifiScanPayload.encode(payload).finish();
  console.log(buffer);
  if (self.isSec) {
    buffer = aesCtr.encrypt(buffer);
  }
  return toBuffer(buffer);
}
const wifiScanRes0 = (self, data) => {
  try {
    let sessionRoot = protobuf.Root.fromJSON(sessionProto);
    let sessionData = sessionRoot.lookupType("SessionData");
    console.log("358", sessionData.decode(data));
    self.sessionResp0 = sessionData.decode(data)
    if (self.isSec) {
      request(self, softApConfig.sendSessionurl, protobufSec1(self), wifiScanRes0sec, "获取WiFi列表失败");
    } else {
      request(self, softApConfig.sendScanWifiurl, wifiScanReq(self), wifiScanRes1, "获取WiFi列表失败");
    }

  } catch (res) {
    console.log(res);
    Taro.hideLoading();
  }
}
const wifiScanRes0sec = (self, data) => {
  try {
    let sessionRoot = protobuf.Root.fromJSON(sessionProto);
    let sessionData = sessionRoot.lookupType("SessionData");
    console.log("358", sessionData.decode(data));
    self.sessionResp1 = sessionData.decode(data)
    let decryptedBytes = aesCtr.decrypt(self.sessionResp1.sec1.sr1.deviceVerifyData);
    if (JSON.stringify(decryptedBytes) == JSON.stringify(self.clientKey.public)) {
      request(self, softApConfig.sendScanWifiurl, wifiScanReq(self), wifiScanRes1, "获取WiFi列表失败");
    } else {
      Taro.hideLoading();
      showToast("获取WiFi列表失败");
    }

  } catch (res) {
    console.log(res);
    Taro.hideLoading();
  }
}
const wifiScanRes1 = (self, data) => {
  console.log(data);
  try {
    let wifiScanRoot = protobuf.Root.fromJSON(wifiScanProto);
    let wiFiScanPayload = wifiScanRoot.lookupType("WiFiScanPayload"); //SessionData
    if (self.isSec) {
      data = aesCtr.decrypt(new Uint8Array(data));
    }
    console.log(wiFiScanPayload.decode(data))
    request(self, softApConfig.sendScanWifiurl, wifiScanReq1(self), wifiScanRes2, "获取WiFi列表失败");
  } catch (res) {
    console.log(res);
    Taro.hideLoading();
  }
}
const wifiScanRes2 = (self, data) => {
  console.log(data);
  try {
    let wifiScanRoot = protobuf.Root.fromJSON(wifiScanProto);
    let wiFiScanPayload = wifiScanRoot.lookupType("WiFiScanPayload"); //SessionData
    if (self.isSec) {
      data = aesCtr.decrypt(new Uint8Array(data));
    }
    data = wiFiScanPayload.decode(data);
    console.log(data)
    console.log(data.respScanStatus.resultCount)
    console.log(data.respScanStatus.resultCount && data.respScanStatus.resultCount > 0)
    if (data.respScanStatus.resultCount && data.respScanStatus.resultCount > 0) {
      request(self, softApConfig.sendScanWifiurl, wifiScanReq2(self, data.respScanStatus.resultCount), wifiScanRes3, "获取WiFi列表失败");
    } else {
      Taro.hideLoading();
      self.wifiList = []
    }
  } catch (res) {
    console.log(res);
    Taro.hideLoading();
  }
}
const wifiScanRes3 = (self, data) => {
  console.log(data);
  try {
    let wifiScanRoot = protobuf.Root.fromJSON(wifiScanProto);
    let wiFiScanPayload = wifiScanRoot.lookupType("WiFiScanPayload"); //SessionData
    if (self.isSec) {
      data = aesCtr.decrypt(new Uint8Array(data));
    }
    console.log(wiFiScanPayload.decode(data))
    data = wiFiScanPayload.decode(data);
    if (data.msg == 5 && data.respScanResult.entries) {
      data = data.respScanResult.entries;
      data.forEach((item, i) => {
        let ssid = hexCharCodeToStr(ab2hex(item.ssid).join(""));
        let bssid = ab2hex(item.bssid).join("");
        item.SSID = ssid;
        item.BSSID = bssid;
        if (item.auth == 0) {
          item.secure = false;
        } else {
          item.secure = true;
        }
        data.splice(i, 1, item);
      })
      console.log(data)
      Taro.hideLoading();
      self.wifiList = data
    }
  } catch (res) {
    console.log(res);
    Taro.hideLoading();
  }
}
const showModel = (title, content, flag) => {
  Taro.hideLoading();
  Taro.showModal({
    title: title,
    content: content,
    showCancel: flag,
    success(res) {}
  })
}
const showToast = msg => {
  Taro.showToast({
    title: msg,
    icon: 'none'
  })
}
const showLoading = msg => {
  Taro.showLoading({
    title: msg,
    mask: true
  });
}
const showIconToast = (msg, icon) => {
  Taro.showToast({
    title: msg,
    icon: icon
  })
}
const rand = () => {
  let arr = [];
  for (let i = 0; i < 32; i++) {
    arr.push(Math.floor(Math.random() * (255 - 1) + 1));
  }
  return arr;
}
//判断非空
const _isEmpty = str => {
  if (str === "" || str === '""' || str === "''" || str === null || str === undefined || str === "null" || str === "undefined") {
    return true;
  } else {
    return false;
  }
}
const getWifiStorage = () => {
  let wifiStorage = Taro.getStorageSync("WIFISTORAGE");
  if (_isEmpty(wifiStorage)) {
    wifiStorage = {};
  }
  return wifiStorage;
}
const setWifiStorage = (name, pwd) => {
  let wifiStorage = getWifiStorage()
  wifiStorage[name] = pwd;
  Taro.setStorage({
    key: "WIFISTORAGE",
    data: wifiStorage
  })
}

const toBuffer = (buffer) => {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}
//转16进制
const ab2hex = buffer => {
  let hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr;
}
//16进制转字符串
const hexCharCodeToStr = hex => {
  let trimedStr = hex.trim();
  let rawStr =
    trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
  let len = rawStr.length;
  if (len % 2 !== 0) {
    alert("Illegal Format ASCII Code!");
    return "";
  }
  let curCharCode;
  let resultStr = [];
  for (let i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
}
export {
  request,
  getWifiStorage,
  protoSession,
  decodeSessionResp0,
  decodeSessionResp1,
  toBuffer,
  ab2hex,
  hexCharCodeToStr,
  wifiScanRes0,
  getSessionVer,
  sendCustomData
}
