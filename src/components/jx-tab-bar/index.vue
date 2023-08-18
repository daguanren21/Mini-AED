<template>
    <div>
        <nut-tabbar @tab-switch="tabSwitch" :model-value="activeTab" class="w-full">
            <nut-tabbar-item name="guide" tab-title="操作指南">
                <template #icon>
                    <Find></Find>
                </template>
            </nut-tabbar-item>
            <nut-tabbar-item name="mini-advice" tab-title="问题咨询">
                <template #icon>
                    <IconFont font-class-name="iconfont" class-prefix="icon" name="zhishiwenda" size="20" />
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
import { IconFont } from '@nutui/icons-vue-taro';
import { Find, My } from '@nutui/icons-vue-taro';
import { useAuthStore } from '~/store/auth';
import { storeToRefs } from 'pinia';
defineOptions({
    name: 'JxTabBar'
})
const auth = useAuthStore()
const activeTab = ref('guide')
watch(() => auth.tabName, (value) => {
    activeTab.value = value
    console.log('11111111', activeTab.value)
},{
    immediate:true
})
function tabSwitch(item, index) {
    activeTab.value = index
    auth.updateTabName(index)
    Taro.switchTab({
        url: `/pages/${item.name}/index`
    })
}
</script>