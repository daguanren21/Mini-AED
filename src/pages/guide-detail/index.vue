<template>
    <view class="news_wrap bg-hex-fff mt-2px">
        <nut-backtop>
            <template v-slot:content>
                <div class="p-x-50px pb-20px ">
                    <view class="title">{{ info?.title }}</view>
                    <view class="publish_time">
                        <text>{{ dateFilter(info?.publishTime) }}</text>
                        <text class="ml-20">{{ info?.readCount }}人阅读</text>
                    </view>
                    <!-- <view class="content"> {{ removeHTMLTag(info.content) }} </view> -->
                    <view class="content">
                        <rich-text :nodes="info?.content" space="nbsp"></rich-text>
                    </view>
                </div>

            </template>
        </nut-backtop>
    </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import dayjs from "dayjs"
import { useLoad, useRouter } from '@tarojs/taro'
import { GuideInfo, fetchGuideInfo, saveNewsKnowledgeRead } from '~/request/api/login';
const router = useRouter()
const info = ref<GuideInfo>()
function dateFilter(date: string | undefined) {
    if (!date) return "---"
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss")
}
useLoad(async () => {
    let { id } = router.params
    await saveNewsKnowledgeRead(Number(id));
    let res = await fetchGuideInfo(Number(id))
    info.value = res
    if (res.title) {
        Taro.setNavigationBarTitle({
            title: res.title
        })
    }
})
</script>

<style lang="scss">
.news_wrap {
    .title {
        margin-top: 26px;
        font-size: 38px;
        font-weight: bold;
        color: #3e3a39;
    }

    .image {
        height: 330px;
        margin: 26px 0;
    }

    .publish_time {
        margin-top: 20px;
        font-size: 26px;
        font-weight: 400;
        color: #717071;
    }

    .content {
        margin: 25px 0;
        font-size: 34px;
        font-weight: 400;
        color: #727171;
        line-height: 42px;
    }
}
</style>