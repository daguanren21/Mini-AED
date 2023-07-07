import { defineStore } from 'pinia'
import { Auth } from '~/request/api/login'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authInfo: {
            id_token: '',
            openid: '',
            unionid: '',
            phoneNumber: '',
        } as Auth,
        tabName: 'mini-advice'
    }),
    actions: {
        updateAuthInfo(authInfo) {
            this.$state.authInfo = authInfo
        },
        updateTabName(tabName) {
            this.$state.tabName = tabName
        }
    }
})