<template>
    <page-layout>
        <nut-toast :msg="state.msg" v-model:visible="state.show" :type="state.type" :cover="state.cover" />
        <view class="flex bg-hex-ffffff p-y-20px m-10px rounded-15px">
            <div class="pl-20px">
                <button style="padding:0;margin: 0;"
                    class="h-150px w-150px rounded-full text-26px line-height-150px text-truncate" @chooseavatar="getAvatar"
                    open-type="chooseAvatar">
                    <span v-if="!avatarUrl">
                        设置头像
                    </span>
                    <img class="w-180px h-180px" mode="aspectFill" v-else :src="avatarUrl" alt="">
                </button>
            </div>
            <div class="flex-col justify-center items ml-20px">
                <div class="mb-15px">
                    <span class="text-34px">{{ nickName || "暂无用户信息" }}</span>
                </div>
                <div class="flex-y-center text-30px text-hex-#ededed">
                    <span class="mr-20px">{{ phoneNumber || '暂无手机号信息' }}</span>
                    <nut-button v-if="!phoneNumber" @getphonenumber="getPhoneNumber" class="center-button" type="primary"
                        open-type="getPhoneNumber">授权</nut-button>
                </div>
            </div>
        </view>
        <nut-cell-group>
            <nut-cell @click="toPage('feed-back')" title="功能反馈" class="border-b-1px border-b-solid b-hex-ededed" is-link>
                <template v-slot:icon>
                    <IconFont color="#fa2c19" font-class-name="iconfont" class-prefix="icon" name="wentifankui" size="24" />
                </template>
            </nut-cell>
            <nut-cell @click="toPage('systemInfo')" class="border-b-1px border-b-solid b-hex-ededed" desc="V1.0.0"
                title="关于系统" is-link>
                <template v-slot:icon>
                    <IconFont color="#1890ff" font-class-name="iconfont" class-prefix="icon" name="guanyuwomen" size="24" />
                </template>
            </nut-cell>
            <nut-cell @click="toMiniProgram" sub-title="把救命神器布防点位分享给身边人" title="前往AED急救地图" is-link>
                <template v-slot:icon>
                    <IconFont color="#1899" font-class-name="iconfont" class-prefix="icon" name="anzhuang" size="24" />
                </template>
            </nut-cell>
        </nut-cell-group>
    </page-layout>
</template>
  
<script setup lang="ts">
import Taro from '@tarojs/taro';
import { IconFont } from '@nutui/icons-vue-taro';
import { useDidShow } from '@tarojs/taro';
import { oneKeyForLogin } from '~/request/api/login';
import { useAuthStore } from '~/store/auth';
import { useToast } from "~/composables"
const avatarUrl = ref(Taro.getStorageSync('avatarUrl') || '')
const auth = useAuthStore()
const hidePhoneNumber = /^(\d{3})\d{4}(\d{4})$/;
const phoneNumber = computed(() => auth.authInfo.phoneNumber ? auth.authInfo.phoneNumber.replace(hidePhoneNumber, "$1****$2") : '')
const nickName = ref('')
const { state, openToast } = useToast()
useDidShow(async () => {
    let { userInfo } = await Taro.getUserInfo()
    nickName.value = userInfo.nickName
})
const getAvatar = (e) => {
    avatarUrl.value = e.detail.avatarUrl
    Taro.setStorageSync('avatarUrl', e.detail.avatarUrl)
}
const getPhoneNumber = async (e) => {
    let { errMsg, iv, encryptedData } = e.detail
    if (errMsg == "getPhoneNumber:ok") {
        let res = await oneKeyForLogin({
            unionid: auth.authInfo.unionid,
            iv,
            encryptedData
        })
        auth.updateAuthInfo(res)
        if (!res) {
            openToast('error', "微信登录失败")
            return Promise.reject("微信登录失败")
        }
        if (!res.id_token) {
            openToast('error', "微信授权失败")
            return Promise.reject("微信授权失败");
        }
    }
}
function toPage(name: string) {
    if (name === 'feed-back' && !phoneNumber) {
        openToast('warn', "请先微信授权")
        return
    }
    Taro.navigateTo({
        url: `/pages/${name}/index`
    })
}
//跳转到AED急救地图小程序
function toMiniProgram() {
    console.log(auth.deviceSn)
    Taro.navigateToMiniProgram({
        appId: 'wx87eed2c15caaca73',
        path: 'improvePages/deviceGuide/index?deviceSn='+auth.deviceSn,
        envVersion:'trial',
        extraData: {
            deviceSn: auth.deviceSn
        }
    })
}
</script>

<style lang="scss">
@import url(./index.scss);

.nut-cell__title {
    justify-content: center;
}

.nut-cell__value {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: inherit;
    color: #000;
}
</style>
  
