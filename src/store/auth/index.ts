import { defineStore } from 'pinia'
import { Auth } from '~/request/api/login'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authInfo: {
            id_token: 'admin',
            openid: '',
            unionid: '',
            phoneNumber: '',
        } as Auth,
        deviceSn: '',
        config:'',
        tabName: 'guide',
        isRead: false
    }),
    actions: {
        updateAuthInfo(authInfo) {
            this.authInfo = authInfo
        },
        updateTabName(tabName) {
            this.tabName = tabName
        }
    }
})