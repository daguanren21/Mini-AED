<template>
    <view class="wifi">
        <view class="wifi_title">
            <text class="wifi_title_wrap"> SoftAp 配网</text>
            <text class="wifi_title_tip"> 选择路由器WIFI</text>
        </view>
        <view class="wifi_content">
            <nut-form>
                <nut-form-item label="WIFI">
                    <nut-input class="nut-input-text" v-model="state.currentWifi.SSID" @click="showWifiList"
                        placeholder="请选择Wifi"  :readonly="true" />
                </nut-form-item>
                <nut-form-item label="密码">
                    <nut-input type="password" v-model="state.currentWifi.password" class="nut-input-text"
                        placeholder="请输入Wifi密码" />
                </nut-form-item>
            </nut-form>
        </view>
        <div class="wifi_btn flex-x-center w-full">
            <nut-button class="btn" type="primary" size="normal" @click="startConnectDeviceWifi">一键配网</nut-button>
        </div>
        <div v-show="state.isShowList" class="model-wrap">
            <div @click="state.isShowList = false" class="mask"></div>
            <div class="model-content">
                <div class="title">WiFi列表
                    <text @tap="getWifiListWay" class="refresh">刷新</text>
                </div>
                <div class="wifi-list">
                    <div class="model-item" @click="state.selectWifiInfo(index)" v-for="(item, index) in state.wifiList"
                        :key="item.bssid" :class="{ red: item.BSSID == state.currentWifi.BSSID }">
                        <div div class="name">{{ item.SSID }}</div>
                        <div class="icon">
                            <image class="img" :src="item.icon"></image>
                        </div>
                    </div>
                </div>
                <div @click="state.isShowList = false" class="footer">取消</div>
            </div>
        </div>
    </view>
</template>

<script setup lang="ts">
import Taro, { getCurrentPages } from "@tarojs/taro";
import { showModal, showToast, wifiErrMsg } from "~/utils/index";
import { softApConfig } from "~/request/constant";
import * as custom from "~/utils/proto-custom.js";
const pages = getCurrentPages();
const current = pages[pages.length - 1];
const platform = Taro.getStorageSync("platform")
const eventChannel = current.getOpenerEventChannel();
const state = reactive({
    userLocation: false,
    ssid: "", //AED设备端的WiFi名称
    isStartConnect: false,
    //路由器WiFiuserLocation
    currentWifi: {
        bssid: "",
        BSSID: "",
        SSID: "",
        password: "",
        is5G: false,
        secure: true,
    },
    wifiList: [
        {
            bssid: "",
            BSSID: "",
            SSID: "",
            icon: "",
        },

    ],
    secretKey: "",
    isSec: false, // 是否加密，请暂时手动修改
    clientKey: {},
    sessionResp0: {},
    sessionResp1: {},
    isConnectSuc: true,
    isShowList: false,
    password: "", //AED设备端的WiFi密码
    pop: "abcd1234", //可有可无
    selectWifiInfo: (index) => {
        let wifi: any = state.wifiList[index];
        state.currentWifi = {
            ...wifi,
            secure: !!wifi.secure,
            password: "",
            is5G: false,
        };
        state.isShowList = false;
    },
    // 发送WiFi信息
    sendWiFiConfig: (buffer, fun) => {
        console.log("sendWiFiConfig");
        custom.request(
            state,
            softApConfig.sendWiFiConfigurl,
            buffer,
            fun,
            "设备配网失败"
        );
    },
    // 创建session
    sendSessionData: (buffer, fun) => {
        custom.request(
            state,
            softApConfig.sendSessionurl,
            buffer,
            fun,
            "设备配网失败"
        );
    },

})
function showWifiList() {
    console.log('wifiListCCCC', state.wifiList)
    if (state.wifiList[0].BSSID == "") {
        getWifiListWay();
    }
    state.isShowList = true;
    state.isStartConnect = false;
}
const getWifiList = () => {
    custom.request(
        state,
        softApConfig.sendSessionurl,
        custom.protoSession(state),
        custom.wifiScanRes0,
        "获取WiFi列表失败"
    );
};
const getWifiListWay = () => {
    Taro.showLoading({
        title: "获取WiFi列表中...",
        mask: true,
    });
    if (platform == "ios") {
        custom.getSessionVer(state, getWifiList);
    } else {
        if (state.userLocation) {
            getWifiListByAndroid();
        } else {
            getUserLocation(getWifiListByAndroid);
        }
    }
};
eventChannel.on("dataFromWifiConfig", (res) => {
    console.log("当前参数", res);
    state.ssid = res.name;
});
const startConnectWifi = () => {
    if (!state.isConnectSuc) {
        return;
    }
    custom.getSessionVer(state, startProtoWifi);
};
const startProtoWifi = () => {
    if (platform == "ios") {
        setTimeout(() => {
            state.sendSessionData(
                custom.protoSession(state),
                custom.decodeSessionResp0
            );
        }, 1000);
    } else {
        Taro.showLoading({
            title: "设备配网中...",
            mask: true,
        });
        console.log("custom", custom);
        state.sendSessionData(
            custom.protoSession(state),
            custom.decodeSessionResp0
        );
    }
};
const connectDeviceWiFi = () => {
    Taro.showLoading({
        title: "设备配网中...",
        mask: true,
    });
    Taro.connectWifi({
        SSID: state.ssid,
        password: state.password,
        success(res) {
            if (platform == "ios") {
                Taro.getConnectedWifi({
                    success(res) {
                        if (res.wifi.SSID != state.ssid) {
                            state.isConnectSuc = false;
                            Taro.hideLoading();
                        } else {
                            state.isConnectSuc = true;
                            console.log("160:", res);
                            setTimeout(() => {
                                startConnectWifi();
                            }, 1000);
                        }
                    },
                });
            } else {
                state.isConnectSuc = true;
                console.log("170:", res);
                // 不加延时加密传输是容易出现报错的情况
                setTimeout(() => {
                    startConnectWifi();
                }, 1000);
            }
        },
        fail(res) {
            console.log("176:", res);
            Taro.hideLoading();
            if (
                res.errCode == 12010 &&
                res.errMsg == "connectWifi:fail:can't gain current wifi"
            ) {
                state.isConnectSuc = true;
                setTimeout(() => {
                    startConnectWifi();
                }, 1000);
                return;
            }
            state.isConnectSuc = false;
            showToast('手机连接设备WiFi失败，请检查设备WiFi后点击"重连"按钮！');
        },
    });
};
const getOnWifiList = () => {
    Taro.onGetWifiList((res) => {
        let list = [] as any[];
        let flag = false;
        res.wifiList.forEach((item: any) => {
            if (
                (item.frequency <= 4900 || item.frequency >= 5900) &&
                item.SSID != "" &&
                item.SSID != state.ssid
            ) {
                let signalStrength = item.signalStrength;
                let icon = "";
                if (platform != "ios") {
                    if (item.secure) {
                        if (signalStrength >= 66) {
                            icon = "wifi-secret-3";
                        } else if (signalStrength >= 33) {
                            icon = "wifi-secret-2";
                        } else {
                            icon = "wifi-secret-1";
                        }
                    } else {
                        if (signalStrength >= 66) {
                            icon = "wifi-no-3";
                        } else if (signalStrength >= 33) {
                            icon = "wifi-no-2";
                        } else {
                            icon = "wifi-no-1";
                        }
                    }
                }
                item.icon = require(`../../assets/images/${icon}${item.BSSID == state.currentWifi.BSSID ? "-active" : ""
                    }.svg`);
                list.push(item);
            }
            if (item.SSID == state.ssid) {
                flag = true;
            }
        });
        state.wifiList = list;
        if (state.isStartConnect) {
            if (flag) {
                connectDeviceWiFi();
            } else {
                Taro.hideLoading();
                showToast("没有扫描到AP，请检查AP是否开启");
            }
        } else {
            Taro.hideLoading();
        }
    });
};
const getWifiListByAndroid = () => {
    Taro.getWifiList({
        success(res) {
            console.log("wifilIst", res);
        },
        fail(res) {
            console.log(res);
            Taro.hideLoading();
            showToast(wifiErrMsg(res.errCode));
        },
    });
    getOnWifiList();
};
//获取当前WiFi
const getCurrentWiFi = (res) => {
    const wifi = res.wifi;
    if (state.ssid != wifi.SSID && wifi.SSID) {
        console.log(wifi.SSID);
        const is5G = wifi.frequency > 4900 && wifi.frequency < 5900;
        state.currentWifi = { ...wifi, is5G, password: "" };
        // show5GModal(is5G);
        // getPwd(wifi.SSID);
        if (is5G) {
            showModal("当前为5G网络，请切换网络", "我知道了", (bol) => {
                console.log(bol);
            });
        }
    }
};
const initWifi = () => {
    console.log("initWifi");
    Taro.startWifi({
        success() {
            Taro.getConnectedWifi({
                success(res) {
                    Taro.hideLoading();
                    getCurrentWiFi(res);
                },
                fail(res) {
                    console.log("83", res);
                },
            });
            Taro.onWifiConnected((res) => {
                console.log(res);
                getCurrentWiFi(res);
            });
        },
        fail() {
            Taro.hideLoading();
            showToast("设置失败");
        },
    });
};
const getUserLocation = (fun?) => {
    Taro.getSetting({
        success(res) {
            console.log(res);
            if (!res.authSetting["scope.userLocation"]) {
                Taro.authorize({
                    scope: "scope.userLocation",
                    success(res) {
                        console.log(res);
                        state.userLocation = true;
                        if (fun) {
                            fun();
                        }
                    },
                });
            } else {
                state.userLocation = res.authSetting["scope.userLocation"];
                getWifiListByAndroid();
                Taro.getConnectedWifi({
                    success(res) {
                        getCurrentWiFi(res);
                    },
                    fail(res) {
                        console.log("getConnectedWifi:fail", res);
                    },
                });
            }
        },
    });
};
getUserLocation();
initWifi();
const startConnectDeviceWifi = () => {
    let is5G = state.currentWifi.is5G;
    if (is5G) {
        showModal(
            "当前为5G网络，请确保您的网络为混合网络",
            "继续",
            searchSoftap(),
            true
        );
        return;
    }
    if (state.currentWifi.secure && state.currentWifi.password.length < 8) {
        showModal("密码长度不能小于8位", "我知道了", () => { });
        return;
    }
    searchSoftap();
};
const searchSoftap = () => {
    state.isStartConnect = true;
    if (platform == "ios") {
        connectDeviceWiFi();
    } else {
        console.log(state.userLocation);
        Taro.showLoading({
            title: "设备配网中...",
            mask: true,
        });
        if (state.userLocation) {
            Taro.getWifiList({
                success(res) {
                    console.log(res);
                },
                fail(res) {
                    console.log(res);
                },
            });
        } else {
            Taro.showModal({
                title: "授权提示",
                content: "小程序需要使用位置信息，更精确的获取WiFi和配网",
                confirmText: "授权",
                success(res) {
                    if (res.confirm) {
                        Taro.openSetting({
                            success(res) {
                                console.log(res.authSetting);
                                let userLocation = res.authSetting["scope.userLocation"];
                                userLocation && (state.userLocation = userLocation);
                            },
                        });
                    }
                },
            });
            Taro.hideLoading();
            return;
        }
    }
};
</script>

<style lang="scss">
.wifi {
    height: 100%;
    display: flex;
    flex-direction: column;

    &_title {
        display: flex;
        flex-direction: column;
        padding: 24px;

        &_wrap {
            font-size: 36px;
            font-weight: bold;
            color: #333;
        }

        &_tip {
            margin-top: 25px;
        }
    }

    &_content {
        flex: 1;
    }

    &_btn {
        padding-bottom: 40px;

        .btn {
            width: 600px;
        }
    }
}
</style>