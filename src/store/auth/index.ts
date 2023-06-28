import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '',
        tabName: 'advice'
    }),
    actions: {
        updateToken(token: string) {
            this.$state.token = token
        },
        updateTabName(tabName) {
            this.$state.tabName = tabName
        }
    }
})