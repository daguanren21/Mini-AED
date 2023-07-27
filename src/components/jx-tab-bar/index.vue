<template>
    <div>
        <nut-tabbar @tab-switch="tabSwitch" v-model="activeTab" class="w-full">
            <nut-tabbar-item name="guide" tab-title="操作指南">
                <template #icon>
                    <Find></Find>
                </template>
            </nut-tabbar-item>
            <nut-tabbar-item name="mini-advice" tab-title="问题咨询">
                <template #icon>
                    <Category></Category>
                </template>
            </nut-tabbar-item>
            <nut-tabbar-item name="mini-center" tab-title="个人中心">
                <template #icon>
                    <My></My>
                </template>
            </nut-tabbar-item>
        </nut-tabbar>
    </div>
</template>
<script setup lang="ts">
import Taro from '@tarojs/taro'
import { Category, Find, My } from '@nutui/icons-vue-taro';
import { useAuthStore } from '~/store/auth';
defineOptions({
    name: 'JxTabBar'
})
const auth = useAuthStore()

const activeTab = computed({
    get() {
        return auth.tabName
    },
    set(value) {
        auth.updateTabName(value)
        return true
    }
})

function tabSwitch(item, index) {
    console.log(item, index);
    auth.updateTabName(item.name)
    Taro.switchTab({
        url: `/pages/${item.name}/index`
    })
}
</script>