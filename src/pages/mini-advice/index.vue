<template>
    <page-layout>
        <!-- <div class="flex-center wh-full" >
            <chat v-if="authInfo.id_token" />
            <nut-empty v-else description="请先授权登录"></nut-empty>
        </div> -->
        <div class="wh-full overflow-hidden flex-col">
            <div class="flex-1 pt-10px overflow-hidden mb-20px">
                <scroll-view :scroll-y="true" :scroll-top="scrollTop" style="height:100%;" id="scrollViewRef">
                    <div v-for="item in historyList">
                        <div v-if="item.ask" class="flex-y-center  justify-end w-full  mb-15px">
                            <div class=" ~ mr-10px rounded-15px max-w-500px bg-hex-ffffff  shadow-lg b-1px p-20px">
                                <p class="text-30px">
                                    {{ item.ask }}
                                </p>
                            </div>
                            <div class="w-80px h-80px rounded-full overflow-hidden">
                                <image class="wh-full" v-if="avatarUrl" :src="avatarUrl"></image>
                                <open-data class="wh-full" v-else type="userAvatarUrl"></open-data>
                            </div>
                        </div>
                        <div v-for="answer in item.answer" class="flex-y-center justify-start w-full mb-15px">
                            <div class="w-80px h-80px rounded-full">
                                <image class="wh-full" mode="aspectFill" :src='chatAvatarUrl' />
                            </div>
                            <div class="~ ml-10px rounded-15px max-w-500px bg-hex-ffffff  shadow-lg b-1px p-20px">
                                <p class="text-30px">{{ answer.title }}</p>
                                <template v-if="answer.questions">
                                    <p class="text-30px  p-10px" :class="{ 'primary-color': question.isLink }"
                                        @click="ask(question)" v-for="question in answer.questions">{{ question.title }}</p>
                                </template>
                            </div>
                        </div>
                    </div>
                </scroll-view>
            </div>


            <nut-cell style="margin:0">
                <nut-button color="linear-gradient(to right, #ff6034, #ee0a24)" type="primary"
                    style="width:80%;margin: 0 auto;" @click="confirm">联系久心售后</nut-button>
            </nut-cell>
        </div>

    </page-layout>
</template>
  
<script setup lang="ts">
import Taro, { useDidShow, useReady } from '@tarojs/taro';
import { questionList } from '.';
const chatAvatarUrl = 'https://res.wx.qq.com/mmspraiweb_node/dist/static/openaiplugin/img/answerImage.png'
const avatarUrl = ref(Taro.getStorageSync('avatarUrl') || '')
const scrollTop = ref(0)
useDidShow(async () => {
    const accountInfo = await Taro.getAccountInfoSync();
    avatarUrl.value = Taro.getStorageSync('avatarUrl')
    console.log(accountInfo)
    Taro.nextTick(() => {
        // 使用 Taro.nextTick 模拟 setData 已结束，节点已完成渲染
        Taro.createSelectorQuery().select('#scrollViewRef').boundingClientRect((rect) => {
            console.log(rect)
            Taro.pageScrollTo({
                scrollTop: rect.bottom
            })
        }).exec()
    })

})

const historyList = ref([{
    answer: [{
        title: '您好，我是久心助手请问您有什么需要帮助的么？'
    }, {
        title: '您可能问的问题：',
        questions: [{
            title: '什么是AED?',
            isLink: true,
        }, {
            title: '什么情况下可以使用AED？',
            isLink: true,
        }, {
            title: '如何使用AED？',
            isLink: true,
        }, {
            title: '儿童可以使用AED么？',
            isLink: true,
        }, {
            title: '为什么要布防（准备）AED?',
            isLink: true,
        }, {
            title: 'AED存放应注意什么？',
            isLink: true,
        }]
    }],
    ask: ''
}])
const confirm = () => {
    Taro.makePhoneCall({
        phoneNumber: '400-820-9952'
    })
}
function ask(question: { title: string, isLink: boolean }) {
    if (question.title.includes('400-820-9952')) {
        Taro.makePhoneCall({
            phoneNumber: '400-820-9952'
        })
    }
    if (!question.isLink) return;
    let answer = findAnswer(questionList, question.title)
    historyList.value.push({
        answer,
        ask: question.title
    })
    Taro.createSelectorQuery().select('#scrollViewRef').boundingClientRect((rect) => {
        console.log(rect)
        // Taro.pageScrollTo({
        //     scrollTop: rect.bottom
        // })
        scrollTop.value = historyList.value.length * 272
    }).exec()
}

function findAnswer(data: any, title: string) {
    let answer;
    let len = data.filter(v => v.title === title).length
    if (!len) {
        for (let index = 0; index < data.length; index++) {
            console.log(data[index].title)
            if ('children' in data[index]) {
                answer = findAnswer(data[index].children, title)
                if (answer.length) {
                    return answer
                } else {
                    continue
                }
            }
            continue
        }
    }
    answer = data.filter(v => v.title === title).map(v => {
        let questions: {
            title: string,
            isLink: boolean
        }[] = []
        if ('answer' in v) {
            if (typeof v.answer === 'string') {
                questions.push({
                    title: v.answer,
                    isLink: false
                })
            } else {
                questions = v.answer.map(v => {
                    return {
                        title: v.step,
                        isLink: false
                    }
                })
            }
        } else if ('children' in v) {
            questions = v.children.map(v => {
                return {
                    title: v.title,
                    isLink: true
                }
            })
        }

        return {
            title: v.title,
            questions
        }
    })
    return answer
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
  