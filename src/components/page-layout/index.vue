<template>
    <view class="index flex flex-col h-full overflow-hidden">
        <view class="flex-1 overflow-hidden">
            <slot></slot>
        </view>
        <jx-tab-bar></jx-tab-bar>
    </view>
</template>

<script setup lang="ts">
defineOptions({
    name: 'PageLayout'
})
</script>

<style scoped lang="scss">
.index {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}
</style>