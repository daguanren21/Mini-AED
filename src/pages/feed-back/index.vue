<template>
    <div class="p-30px">
        <nut-toast :msg="state.msg" v-model:visible="state.show" :type="state.type" :cover="state.cover" />
        <div class="mb-15px">
            <p class="mb-10px text-30px font-bold">反馈与建议</p>
            <nut-textarea v-model="feedback.content" class="h-200px" limit-show max-length="200" />
        </div>
        <div class="mb-15px">
            <p class="mb-10px text-30px font-bold">手机号</p>
            <nut-input v-model="feedback.phoneNumber" placeholder="请输入手机号（选填）" />
        </div>
        <div class="mb-15px">
            <p class="mb-10px text-30px font-bold">反馈图片</p>
            <nut-uploader @delete="deleteFiles" :url="uploadUrl" :before-xhr-upload="beforeXhrUpload"
                maximum="4"></nut-uploader>
        </div>
        <div class="w-full flex-x-center mt-20px">
            <nut-button style="width:90vw" type="primary" @click="handleSubmit">提交反馈</nut-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { reactive, ref } from 'vue';
import { useAuthStore } from "../../store/auth";
import { baseUrl } from "../../request/constant";
import { saveFeedBack } from "../../request/api/login"
import { useToast } from '../../composables';
const phonePattern = /^1\d{10}$/
const auth = useAuthStore()
const feedback = reactive({
    content: '',
    phoneNumber: ''
})
let token: string = auth.authInfo.id_token
const { state, openToast } = useToast()
const uploadUrl = ref(baseUrl + '/v1/oss-files')
const _fileList = ref<string[]>([])
function beforeXhrUpload(taroUploadFile, options) {
    taroUploadFile({
        url: options.url,
        filePath: options.taroFilePath,
        name: 'file',
        header: {
            Authorization: `Bearer ${token}`,
            'accept-language': 'zh-CN'
        },
        success(response: { errMsg: any; statusCode: number; data: string }) {
            if (response.statusCode === 201) {
                let data = JSON.parse(response.data)
                _fileList.value.push(data.urlPath)
                options.onSuccess?.(response, options);
            } else {
                options.onFailure?.(response, options);
            }
        },
        fail(e: any) {
            options.onFailure?.(e, options);
        }
    })

}
async function handleSubmit() {
    let { content, phoneNumber } = feedback
    if (!content) {
        openToast('text', '反馈建议不能为空')
        return
    }
    if (phoneNumber && !phoneNumber.match(phonePattern)) {
        openToast('text', '手机号码格式不正确')
        return
    }
    try {
        await saveFeedBack({
            content: feedback.content,
            phoneNumber: feedback.phoneNumber || auth.authInfo.phoneNumber,
            source: 'Mini AED',
            feedBackType: 'PROBLEM',
            imagePath: _fileList.value ? _fileList.value.join(';') : '',
            userName: feedback.phoneNumber || auth.authInfo.phoneNumber
        })
        openToast('success', '感谢您提交的反馈！')
        setTimeout(() => {
            Taro.navigateBack()
        }, 500)
    } catch (error) {
        openToast('text', error)
    }

}
function deleteFiles({ files, fileList, index }) {
    _fileList.value.splice(index, 1)
    console.log(files, fileList)
}
</script>

<style scoped></style>