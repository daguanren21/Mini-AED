<template>
    <view class="service_info p-x-20px">
        <view class="header">
            <image src="../../assets/images/jx-logo.svg"></image>
            <view class="title">久心急救</view>
            <view class="version">V1.0.0</view>
        </view>
        <view class="at-article">
            <view class="at-article__content">
                <view class="at-article__section">
                    <view class="at-article__p">
                        家庭急救宝是久心医疗科技（苏州）有限公司具有完全自主知识产权、面向社会公众的AED设备。久心急救提供问题咨询、操作指南、个人中心等功能，为了给用户日常维护以及使用提供相关指南。
                    </view>
                </view>
            </view>
        </view>
        <view class="footer">
            <view>久心医疗科技（苏州）有限公司版权所有</view>
            <view>Copyright © 2023 Jousing. All Rights Reserved.</view>
        </view>
    </view>
</template>
<script setup lang="ts" >
</script>
  
<style lang="scss">
.service_info {
    height: 100%;
    overflow: auto;
    background-color: #fff;

    .header {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 90px 0;

        image {
            width: 150px;
            height: 150px;
            margin-bottom: 30px;
        }

        .title {
            margin-bottom: 10px;
            font-size: 36px;
            font-weight: bold;
            color: #333;
        }

        .version {
            font-weight: 400;
            font-size: 26px;
            color: #333;
        }
    }

    .footer {
        position: absolute;
        width: 100%;
        bottom: 20px;
        text-align: center;
        font-size: 24px;
        color: #7d8fac;
    }
}

.at-article__h3 {
    margin-top: 20px;
}

.at-article__p {
    text-indent: 2em;
    font-size: 32px;
    line-height: 60px;
}
</style>
  
  
  