<script setup lang="ts">
import {ElScrollbar} from "element-plus";
import dayjs from "dayjs";
import {useTagStore} from "@/store/tags.ts";

const buildTime = dayjs(__BUILD_TIME__).format('YYYY-MM-DD HH:mm:ss Z')
const tagStore = useTagStore()
</script>

<template>
<ElScrollbar>
  <h1>关于</h1>
  <p>这是一个用于构建 Danbooru 标签组合的网站。</p>
  <p>
    当前版本为 {{ buildTime }} 构建的版本。目前共收录 {{ tagStore.tagTotalSize }} 个标签。
  </p>
  <p>此项目为前端练习项目，原项目地址为
    <a href="https://github.com/wfjsw/danbooru-diffusion-prompt-builder" target="_blank">danbooru-diffusion-prompt-builder @ GitHub</a>
  </p>
</ElScrollbar>
</template>

<style scoped lang="scss">

</style>