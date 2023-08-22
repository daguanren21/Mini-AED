import { useAuthStore } from "~/store/auth";
import { baseUrl } from "./constant";
import Taro from "@tarojs/taro";

interface RequestBase {
    url: string
    method: Method
    data?: any
    header?: RequestHeader
    title?: string
    loading?: boolean//是否开启加载
    mask?: boolean//是否开启遮罩
    fail?: boolean //是否弹出提示

}
interface RequestHeader {
    'content-type': string
    Authorization?: string
    'accept-language': string
}
export enum Method {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}
const NormalRquestData: RequestBase = {
    url: baseUrl, // 默认请求地址
    method: Method.GET, // 默认get请求
    header: { // 默认使用的header头
        'content-type': 'application/json',
        Authorization: ``,
        'accept-language': 'zh-CN'
    },
    data: {}, // 默认没有参数，传入空对象
    loading: true, //默认开启loading层
    mask: true, //请求时不需要点击
    title: '数据加载中', //loading提示文字
    fail: false // 一般我们会处理相应业务逻辑，就不直接提示阻断流程
}

export const request = async (data: RequestBase): Promise<any> => {
    const auth = useAuthStore()
    let token: string = auth.authInfo.id_token
    let req: RequestBase = { ...NormalRquestData, ...data }
    req.header!.Authorization = `Bearer ${token}`
    // Taro.showLoading({ title: req.title || '数据加载中', mask: req.mask })
    let res = await Taro.request({
        url: baseUrl + req.url, //引入我的接口是特殊声明的，所以我就不检测http/https了
        method: req.method,
        data: req.data,
        header: req.header
    })
    if (res.statusCode === 200 || res.statusCode === 204) {
        // Taro.hideLoading()
        return Promise.resolve(res.data)
    } else {
        // Taro.hideLoading()
        // 如果失败 检测是否直接提示信息
        let { title, detail, message } = res.data
        if (res.statusCode == 500) {
            // reject('服务器内部异常')
            return Promise.reject('服务器内部异常')
        } else {
            // reject() // 失败
            return Promise.reject(detail || message || title || '服务器内部异常')
        }
    }

}