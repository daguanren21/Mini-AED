<template>
    <div class="h-full">
        <div class="h-full" v-if="authInfo.id_token">
            <page-layout>
                <nut-toast :msg="state.msg" v-model:visible="state.show" :type="state.type" :cover="state.cover" />
                <div class="guideList">
                    <div class="h-full pb-20px mt-20px" v-if="guideList.length">
                        <div v-for="item in guideList" :key="item.id" @click="toPage(item.id)"
                            class="cursor-pointer  guide-item p-50px text-center text-40px font-bold rounded-15px relative">
                            <!-- <img mode="aspectFill" class="absolute top-0 bottom-0 left-0 right-0 wh-full" :src="item.titleImagePath" alt="" srcset="" > -->
                            <div class="flex-center">
                                <span class="mr-20px text-shadow primary-color">{{ item.title }}</span>
                                <IconFont class="text-shadow primary-color" font-class-name="iconfont" class-prefix="icon"
                                    name="caozuo" size="24" />
                            </div>
                        </div>
                    </div>
                    <div class="flex-center wh-full" v-else>
                        <nut-empty description="暂无数据"></nut-empty>
                    </div>
                </div>
            </page-layout>
        </div>
        <div v-else>
            <nut-empty image="empty" description="暂无查看权限，请授权后查看">
                <div style="margin-top: 10px">
                    <nut-button @getphonenumber="dialog.getPhoneNumber" class="center-button" type="primary"
                        open-type="getPhoneNumber">授权登录</nut-button>
                </div>
            </nut-empty>
        </div>
        <nut-dialog title="温馨提示" content="后续后台监控到AED出现相关问题，售后可以联系到您并及时解决问题。" v-model:visible="dialog.show">
            <template #footer>
                <nut-button @getphonenumber="dialog.getPhoneNumber" class="center-button" type="primary"
                    open-type="getPhoneNumber">授权登录</nut-button>
            </template>
        </nut-dialog>
        <nut-dialog title="温馨提示" text-align="left"
            content="用于治疗疑似心脏骤停患者（无反应、无脉搏、无呼吸或呼吸不正常），其中儿童模式适用于0至7岁的患者，成人模式适用于8岁及以上的患者。" v-model:visible="useTip.show">
            <template #footer>
                <nut-button @click="useTip.confirm" class="center-button" type="primary">已阅读</nut-button>
            </template>
        </nut-dialog>
    </div>
</template>
  
<script setup lang="ts">
import { IconFont } from '@nutui/icons-vue-taro';
import Taro, { useDidShow } from '@tarojs/taro';
import { storeToRefs } from 'pinia';
import { useToast } from '~/composables';
import { GuideInfo, bindMiniAed, oneKeyForLogin } from '~/request/api/login';
import { fetchOperateGuide } from '~/request/api/login';
import { useAuthStore } from '~/store/auth';
const auth = useAuthStore()

const { authInfo, deviceSn } = storeToRefs(auth)
const { state, openToast } = useToast()
function toPage(id: number) {
    Taro.navigateTo({
        url: "/pages/guide-detail/index?id=" + id,
    })
}
let guideList = ref<GuideInfo[]>([])
useDidShow(async () => {
    let res = await fetchOperateGuide({
        newsKnowledgeType: 'GUIDE',
        page: 1,
        size: 10
    })
    guideList.value = res.content
})
const useTip = reactive({
    show: false,
    confirm: () => {
        useTip.show = false
    }
})
const dialog = reactive({
    show: false,
    getPhoneNumber: async (e) => {
        let { errMsg, iv, encryptedData } = e.detail
        if (errMsg == "getPhoneNumber:ok") {
            let res = await oneKeyForLogin({
                unionid: auth.authInfo.unionid,
                iv,
                encryptedData
            })
            auth.updateAuthInfo(res)
            useTip.show = true
            if (res.phoneNumber && deviceSn.value) {
                await bindMiniAed({
                    contactPhone: res.phoneNumber,
                    serialNumber: deviceSn.value
                })
            }
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
})


watch(() => auth.authInfo.id_token, (val) => {
    dialog.show = !val
}, {
    deep: true
})
// watch(() => auth.isRead, (val) => {
//     debugger
//     useTip.show = !val
// }, {
//     immediate: true
// })
watchEffect(async () => {
    if (authInfo.value.phoneNumber && deviceSn.value) {
        await bindMiniAed({
            contactPhone: auth.authInfo.phoneNumber,
            serialNumber: deviceSn.value
        })
    }
})
</script>
<style lang="scss">
@import "./index.scss";

.guideList {
    height: 100%;

    &>view {
        height: 100%;

        &>scroll-view {
            height: 100% !important;
        }
    }
}

.nut-backtop.show {
    bottom: 100px !important
}
</style>

  