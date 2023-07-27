import { Method, request } from ".."

const api = {
    base: '/v1/mini-program/public',
    auth: '/v1/authenticate/mini-aed',
    feedBack: '/v1/mini-program/feed-backs',
    device:'/v1/mini-program/devices'
}
/**
 * 获取wx登录信息
 * @param data 
 * @returns 
 */
export interface Auth {
    id_token: string,
    unionid: string,
    openid: string,
    phoneNumber: string
}
export function wxLogin(data: {
    appId: string,
    code: string
}): Promise<Auth> {
    return request({
        url: api.auth + '/wx',
        data: data,
        method: Method.POST
    })
}

/**
 * 微信登录
 * @param data 
 * @returns 
 */
export function oneKeyForLogin(data: {
    encryptedData: string,
    iv: string,
    unionid: string
}): Promise<Auth> {
    return request({
        url: api.auth + '/one-key-login',
        data: data,
        method: Method.POST
    })
}
/**
 * 获取操作指南
 * @param data
 */
export interface GuideInfo {
    id: number;
    title: string;
    titleImagePath: string;
    readCount: string;
    likeCount: number;
    content: string;
    publishTime: string;
    description: string;
}
export interface GuidePage {
    content: GuideInfo[],
    totalCount: number,
    totalPage: number
}
export function fetchOperateGuide(data: { newsKnowledgeType: string, page: number, size: number }): Promise<GuidePage> {
    return request({
        url: api.base + '/news-knowledge-bases',
        data: data,
        method: Method.GET
    })
}
export function fetchGuideInfo(id: number): Promise<GuideInfo> {
    return request({
        url: api.base + `/news-knowledge-bases/${id}`,
        method: Method.GET
    })
}

export function saveNewsKnowledgeRead(id: number): Promise<void> {
    return request({
        url: api.base + `/news-knowledge-bases/${id}`,
        method: Method.PUT
    })
}

export interface FeedBackParams {
    content: string;
    feedBackType: "IMPROVEMENT" | "PROBLEM" | "DEMAND" | "OTHER",
    imagePath: string;
    phoneNumber: string;
    source: string;
    userName: string
}
export function saveFeedBack(data: FeedBackParams): Promise<void> {
    return request({
        url: api.feedBack,
        data,
        method: Method.POST
    })
}


export function bindMiniAed(data:{
    serialNumber:string,
    contactPhone:string
}): Promise<void> {
    return request({
        url: api.device + `/mini-bind-phone`,
        data,
        method: Method.POST
    })
}