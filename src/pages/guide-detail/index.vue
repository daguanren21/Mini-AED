<template>
    <div>
        操作指南详情
    </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { useLoad, useRouter } from '@tarojs/taro'
const router = useRouter()
useLoad(() => {
    let { title } = router.params
    if (title) {
        Taro.setNavigationBarTitle({
            title
        })
    }
})
</script>

<style scoped></style>