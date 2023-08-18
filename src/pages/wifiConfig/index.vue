<template>
    <div class="wifi">
        <div class="content flex">
            <nut-button class="btn" @click="isOpened = true"  type="primary">开始配网</nut-button>
            <nut-dialog v-model:visible="isOpened" @close="isOpened = false" title="注意事项">
                <div class="prompt text-left">
                    <view class="prompt-desc">1. 手机WIFI已连接</view>
                    <view class="prompt-desc">2. 手机已给微信授权获取WiFi信息</view>
                    <view class="prompt-desc">3. Android 6.0 以上版本已开启定位</view>
                    <view class="prompt-desc">4. 确保连接的WiFi不是5G网络</view>
                </div>
                <template #footer>
                    <nut-button @click="methods.addConfig" plain type="primary">扫描二维码</nut-button>
                </template>
            </nut-dialog>
        </div>
    </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { isJSON, showModal, showToast } from "~/utils/index"
const isOpened = ref(false)
const methods = reactive({
    addConfig: async function () {
        let { result } = await Taro.scanCode({});
        if (!isJSON(result)) {
            showToast("二维码格式错误,请检查并重新扫描设备二维码");
            return;
        }
        let code: any = JSON.parse(result);
        if (code.name) {
            Taro.navigateTo({
                url: "/pages/softAp/index",
                success: function (res) {
                    res.eventChannel.emit("dataFromWifiConfig", {
                        name: code.name,
                    });
                },
            });
        } else {
            showToast("二维码格式错误,请检查并重新扫描设备二维码");
        }
    }
})
const getSystemInfo = () => {
    const res = Taro.getSystemInfoSync();
    console.log(res);
    let platform = res.platform;
    Taro.setStorageSync("platform", platform)
    let system = res.system.split(" ")[1];
    if (platform == "ios" && system < "11") {
        showModal(
            "当前手机系统版本过低不支持小程序内连接 Wi-Fi.",
            "",
            getSystemInfo()
        );
    }
};
getSystemInfo();
</script>

<style  lang="scss">
.wifi {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .content {
        width: 100%;
        margin: auto;

        .header {
            font-size: 46px;
            text-align: center;
            font-weight: bold;
        }

        .btn {
            width: 80%;
            margin: 30px auto;
        }
    }
}

.prompt {
    padding: 24px;

    &-title {
        font-size: 32px;
        line-height: 2;
    }

    &-desc {
        font-size: 28px;
        line-height: 2;
    }
}
</style>