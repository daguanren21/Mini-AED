<template>
    <div>
        <nut-tabbar @tab-switch="tabSwitch" class="w-full absolute bottom-0">
            <nut-tabbar-item tab-title="问题咨询">
                <template #icon>
                    <Category></Category>
                </template>
            </nut-tabbar-item>
            <nut-tabbar-item tab-title="操作指南">
                <template #icon>
                    <Find></Find>
                </template>
            </nut-tabbar-item>
            <nut-tabbar-item tab-title="个人中心">
                <template #icon>
                    <My></My>
                </template>
            </nut-tabbar-item>
        </nut-tabbar>
    </div>
</template>
<script setup lang="ts">
import { Category, Find, My } from '@nutui/icons-vue-taro';
defineOptions({
    name: 'JxTabBar'
})
defineProps<{
    index: number
}>()

function tabSwitch(item, index) {
    console.log(item, index);
}
</script>