import { createApp } from 'vue'
import App from './App.vue'
import "./style.scss"
import {createPinia} from "pinia";
import {useTagStore} from "@/store/tags.ts";
import {ElInfiniteScroll, vLoading} from "element-plus";

const pinia = createPinia()

createApp(App)
    .use(pinia)
    .directive('infinite-scroll', ElInfiniteScroll)
    .directive('loading', vLoading)
    .mount('#app')

const tagStore = useTagStore()
tagStore.load()


