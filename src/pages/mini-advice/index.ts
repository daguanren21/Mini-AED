export const questionList = [{
    title: 'AED知识',
    children: [{
        title: 'AED最高能量可电击除颤次数?',
        answer: '大于200次'
    }, {
        title: '电极片有效期时间多长？',
        answer: '2.5年'
    }, {
        title: 'AED除颤能量多少？',
        answer: '150J'
    }, {
        title: '除颤波形类别?',
        answer: '低能量双相指数截尾波'
    }, {
        title: '真机AED电极片贴到假人身上会电击吗？',
        answer: '不会'
    }, {
        title: '电极片使用之后还能再使用吗？',
        answer: '电极片是一次性消耗品，不可重复使用。使用后及时更换。'
    }, {
        title: 'Mini AED除颤器可以给儿童使用吗?',
        answer: '可以'
    }, {
        title: 'Mini AED除颤器用英文版吗？',
        answer: '没有，有需求可以定制'
    }, {
        title: 'AED电池可以使用多长时间？',
        answer: '正常可待机5年，如果被使用去抢救，那相应的电池寿命也会随之缩短。电池耗尽时更换AED电池即可重新使用。'
    }, {
        title: 'AED电池可以充电吗？',
        answer: '不可以充电'
    }, {
        title: 'AED第一次报警没电了，还能用于抢救吗？',
        answer: '可以，至少还可以电击除颤10次。但尽快采购电池更换'
    },]
}, {
    title: 'AED使用',
    children: [{
        title: '如何使用AED进行抢救？',
        answer: [{
            step: '1.拍打双肩或者大声呼唤患者，检查其是否有反应'
        }, {
            step: '2. 如果患者不能说话，挪动，立即拨打120，并取出AED'
        }, {
            step: '3. 观察患者胸腹部 5-10 秒，若看不清是否有起伏则判断患者没有呼吸'
        }, {
            step: '4. 若没有反应并且没有呼吸，请立即使用AED'
        }, {
            step: '5. 拉开 AED 外包装，按下电源键开启AED'
        }, {
            step: '6. 拨开患者衣物使胸部裸露'
        }, {
            step: '7. 撕开电极片包装袋并拿出，揭开电极片薄膜按照示意图位置贴牢'
        }, {
            step: '8. 当 AED 提示“不要接触患者”时，请确保没有人触碰患者'
        }, {
            step: '9. 当 AED 放电键亮起时，在确保没有人触碰患者的情况下按下放电键，完成电击'
        }, {
            step: '10.电击完成后，根据 AED 提示进行心肺复苏（将一只手的掌跟放在胸部中央，胸骨下半段，另一只手叠放在这只手上。跟着 AED 的节拍按压。垂直按压至少 5 厘米，每次按压需要让胸部回弹到正常位置后，再进行下一次按压。）'
        }, {
            step: '11. 根据 AED 提示操作直至专业急救人员到达现场，如果患者恢复意识则停止心脏复苏并陪伴在其身边；但在急救人员达到前不要关闭AED，也不要取下电极片'
        },]
    }, {
        title: '客户想拿到抢救数据怎么做？可以本地用U盘导出吗？',
        answer: '单机的话需要邮寄回公司，帮客户导出来；联网的话可以手动上传数据。不可以用U盘导出'
    }, {
        title: '4G版AED设备如何手动上传数据？',
        answer: [{ step: '将电池拿掉，等设备正面的状态指示灯消失之后进行下一步。' }, { step: '长按绿色的电源键，不要松手，将电池插上去。' }, { step: '电池插上去之后等待几秒钟后，提示进入管理模式后，就可以松手了。' }]
    }, {
        title: '机箱控制器如何手动上传抢救数据？',
        answer: [{ step: '长按机箱控制器的激活键5S，在机箱控制器先发“嘀嘀”两声' }, { step: '接着又发“嘀嘀嘀”三声后，立即松开激活键。在AED设备进入管理模式后待AED抢救数据上传完成' }, { step: '最后长按AED的开机键退出管理模式' }]
    }]
}, {
    title: 'AED售后',
    children: [{
        title: '自检异常',
        answer: '拨打400-820-9952热线电话，联系厂家维护'
    }, {
        title: '温度异常',
        answer: '插入电池自检提示温度异常，更换到室内插入电池重新自检'
    }, {
        title: '联系久心售后',
        answer: '拨打400-820-9952热线电话'
    }]
}, {
    title: 'AED配件',
    children: [{
        title: '电池如何更换？',
        answer: '电池低电量报警后及时采购新电池，直接拿下电池安装新的即可'
    }, {
        title: '电极片如何更换？',
        answer: '电极片具有防呆设计，正确插拔电极片插头更换'
    }]
}, {
    title: '机箱配件',
    children: [{
        title: '机箱可以布防在室外么？',
        answer: '不可以，我们产品是室内机箱，不支持室外安装'
    }, {
        title: '机箱声光报警不亮？',
        answer: [{ step: '确认机箱控制器是否有电' }, { step: '确认报警器接线是否良好' }, { step: '确认行程开关是否良好' }, { step: '如果是联网机箱，则需机箱控制器入网之后才会报警' }]
    }, {
        title: '机箱控制器怎么入网？',
        answer: [{ step: 'AED设备进入管理模式' }, { step: '机箱控制器点击激活键1S，在等待1-2分钟后机箱控制器发出"滴滴"声音后正确配对后即可入网成功' }]
    }, {
        title: '显示屏不显示了',
        answer: [{
            step: '打开后柜门排查插座、适配器指示灯'
        }, {
            step: '插座不亮：外接电源原因。检查插头是否插好'
        }, {
            step: '适配器不亮：适配器原因。联系厂家更换适配器'
        }, {
            step: '适配器亮；：屏幕原因，联系厂家更换屏幕'
        }, {
            title: '屏幕花屏',
            answer: '拨打400-820-9952热线电话，联系厂家维护'
        }, {
            title: '屏幕无法播放视频',
            answer: [{
                step: '检查视频文件是否正常'
            }, {
                step: '使用U盘的设备U盘是否正常'
            }]
        }]
    }]
}, {
    title: '设备保养',
    children: [{
        title: 'AED保养',
        answer: [{
            step: '关闭电源，取出电池'
        }, {
            step: '用干净柔软的湿布擦拭'
        }, {
            step: '清洁干燥后再安装电池'
        }]
    }, {
        title: '机箱保养',
        answer: [{
            step: '用干净柔软的湿布擦拭'
        }, {
            step: '禁止使用粗糙的抹布或者其他清洁工具，防止刮花表面'
        }, {
            step: '擦拭后用干抹布擦干表面清洁剂或者水份'
        }]
    }]
}]