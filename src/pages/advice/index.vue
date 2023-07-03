<template>
    <page-layout>
        <div class="flex-center wh-full" >
            <chat v-if="authInfo.id_token" />
            <nut-empty v-else description="请先授权登录"></nut-empty>
        </div>
        <!-- <div class="wh-full">
            <div class="flex-y-center justify-start w-full mb-15px">
                <div class="w-80px h-80px rounded-full">
                    <image class="wh-full" mode="aspectFill"
                        src='https://res.wx.qq.com/mmspraiweb_node/dist/static/openaiplugin/img/answerImage.png' />
                </div>
                <div class="~ ml-10px rounded-15px w-500px  shadow-lg b-1px p-20px">
                    <p class="text-30px">请问您有什么需要帮助的么？</p>
                    <p class="text-30px primary-color" @click="search('AED使用')">AED使用</p>
                    <p class="text-30px primary-color" @click="search('AED安装')">AED安装</p>
                </div>
            </div>
            <div class="flex-y-center  justify-end w-full">
                <div class=" ~ ml-10px rounded-15px w-500px  shadow-lg b-1px p-20px">
                    <p class="text-30px">
                        <rich-text :nodes="nodes"></rich-text>
                    </p>
                </div>
                <div class="w-80px h-80px rounded-full overflow-hidden">
                    <open-data class="wh-full" type="userAvatarUrl"></open-data>
                </div>
            </div>
        </div> -->
    </page-layout>
</template>
  
<script setup lang="ts">
import Taro, { requirePlugin, useDidShow } from '@tarojs/taro';
import { useAuthStore } from '~/store/auth';
const plugin = requirePlugin("chatbot");
const auth = useAuthStore()
const authInfo =computed(()=>auth.authInfo)
useDidShow(async () => {
    // const signRes = await Taro.request({
    //     url: 'https://chatbot.weixin.qq.com/openapi/sign/U6gQND4LC750OBNab9HdMFdfd3PSMt',
    //     method: 'POST',
    //     data: {
    //         userid: '123'
    //     }
    // })
    // signature.value = signRes.data.signature
    const accountInfo = await Taro.getAccountInfoSync();
    console.log(accountInfo)
    if (authInfo.value.openid) {
      plugin.init({
        appid:"U6gQND4LC750OBNab9HdMFdfd3PSMt", //微信对话开放平台小程序插件appid
        openid: authInfo.value.openid, // 小程序用户的openid，必填项
        welcome: "",
        background: "#eee",
        guideList: [],
        guideCardHeight: 50,
        operateCardHeight: 42,
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
      const chat = plugin.getChatComponent()
      chat.setGuideList(['AED使用', 'AED安装'])
    }
})

// function send(){
//     const chat = plugin.getChatComponent();
//     console.log("chat", chat);
// }
// async function search(query: string) {
//     const aibotRes = await Taro.request({
//         url: 'https://chatbot.weixin.qq.com/openapi/aibot/U6gQND4LC750OBNab9HdMFdfd3PSMt',
//         method: 'POST',
//         data: {
//             query,
//             signature: signature.value
//         }
//     })
//     nodes.value = aibotRes.data.answer
//     console.log('id_token', aibotRes.data)
// }
</script>

<style lang="scss">
@import "./index.scss";
</style>
  