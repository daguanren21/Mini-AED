<template>
  <view class="index">
    <nut-toast :msg="msg2" v-model:visible="show" :type="type" :cover="cover" />
    <jx-tab-bar :index="1"></jx-tab-bar>
  </view>
</template>

<script setup lang="ts">
const state = reactive({
  msg: '欢迎使用 NutUI4.0 开发小程序',
  msg2: '你成功了～',
  type: 'text',
  show: false,
  cover: false
});

const { msg2, type, show, cover } = toRefs(state)
</script>

<style lang="scss">
.index {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
