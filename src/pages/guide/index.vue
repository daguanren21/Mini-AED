<template>
    <page-layout>
        <div class="guideList">
            <nut-backtop>
                <template v-slot:content>
                    <div class="h-full pb-20px" v-if="guideList.length">
                        <div v-for="item in guideList" :key="item.id" @click="toPage(item.id)"
                            class="cursor-pointer  guide-item p-50px text-center text-40px font-bold rounded-15px relative">
                            <!-- <img mode="aspectFill" class="absolute top-0 bottom-0 left-0 right-0 wh-full" :src="item.titleImagePath" alt="" srcset="" > -->
                            <div class="flex-center">
                                <span class="mr-20px text-shadow">{{ item.title }}</span>
                                <IconFont class="text-shadow" font-class-name="iconfont" class-prefix="icon" name="caozuo"
                                    size="24" />
                            </div>
                        </div>
                    </div>
                    <div class="flex-center wh-full" v-else>
                        <nut-empty description="暂无数据"></nut-empty>
                    </div>
                </template>
            </nut-backtop>
        </div>
    </page-layout>
</template>
  
<script setup lang="ts">
import { IconFont } from '@nutui/icons-vue-taro';
import Taro, { useDidShow } from '@tarojs/taro';
import { GuideInfo } from '~/request/api/login';
import { fetchOperateGuide } from '~/request/api/login';
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

  