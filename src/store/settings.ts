import { useLocalStorage } from '@vueuse/core'
import {defineStore} from "pinia";

const showRestricted = useLocalStorage('showRestricted', false)

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        showRestricted: showRestricted
    }),
})