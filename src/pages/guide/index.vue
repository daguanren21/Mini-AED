<template>
    <page-layout>
        <div class="h-full overflow-auto">
            <div @click="toPage('AED安装指南')"
                class="cursor-pointer  guide-item p-50px text-center text-40px font-bold rounded-15px">
                <div class="flex-center">
                    <span class="mr-20px">AED安装指南</span>
                    <IconFont font-class-name="iconfont" class-prefix="icon" name="caozuo" size="24" />
                </div>
            </div>
            <div class="guide-item p-50px text-center text-40px font-bold rounded-15px">
                <div class="flex-center">
                    <span class="mr-20px">AED安装指南</span>
                    <IconFont font-class-name="iconfont" class-prefix="icon" name="caozuo" size="24" />
                </div>
            </div>
            <div class="guide-item p-50px text-center text-40px font-bold rounded-15px">
                <div class="flex-center">
                    <span class="mr-20px">AED安装指南</span>
                    <IconFont font-class-name="iconfont" class-prefix="icon" name="caozuo" size="24" />
                </div>
            </div>
            <div class="guide-item p-50px text-center text-40px font-bold rounded-15px">
                <div class="flex-center">
                    <span class="mr-20px">AED安装指南</span>
                    <IconFont font-class-name="iconfont" class-prefix="icon" name="caozuo" size="24" />
                </div>
            </div>
            <div class="guide-item p-50px text-center text-40px font-bold rounded-15px">
                <div class="flex-center">
                    <span class="mr-20px">AED安装指南</span>
                    <IconFont font-class-name="iconfont" class-prefix="icon" name="caozuo" size="24" />
                </div>
            </div>
        </div>
    </page-layout>
</template>
  
<script setup lang="ts">
import { IconFont } from '@nutui/icons-vue-taro';
import Taro from '@tarojs/taro';
function toPage(title: string) {
    Taro.navigateTo({
        url: "/pages/guide-detail/index?title=" + title,
    })
}
</script>
<style lang="scss">
@import "./index.scss";
</style>

  