<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faBars, faShop} from "@fortawesome/free-solid-svg-icons";
import {ElButton} from "element-plus";
import {ElInput} from "element-plus";
import {computed} from "vue";
import {Search as IconSearch} from "@element-plus/icons-vue";
import Settings from "@/views/header/Settings.vue";
import About from "@/components/Link.vue";

const emits = defineEmits(['expandCategory', 'expandTagPanel', 'update:search'])
const props = defineProps<{
  search: string
}>()
const searchInput = computed({
  get: () => props.search,
  set: (value: string) => emits('update:search', value)
})
</script>

<template>
<div class="header">
  <div class="left">
    <ElButton
        size="large"
        text
        class="expand-category-btn"
        @click="emits('expandCategory')">
      <FontAwesomeIcon :icon="faBars" />
    </ElButton>
    <span class="title">Danbooru 标签</span>
  </div>
  <div class="right">
    <ElInput
        v-model="searchInput"
        class="search"
        :prefix-icon="IconSearch"
        placeholder="搜索"/>
    <div class="mobile-hidden-header">
      <Settings />
      <About />
    </div>
    <ElButton
        size="large"
        text
        class="expand-tag-panel-btn"
        @click="emits('expandTagPanel')">
      <FontAwesomeIcon :icon="faShop" />
    </ElButton>
  </div>
</div>
</template>

<style lang="scss" scoped>
.header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.left, .right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.left {
  color: var(--el-text-color-primary);
}

.right {
  justify-content: flex-end;
}

.mobile-hidden-header {
  display: inherit;
  gap: inherit;
  align-items: inherit;
}

.expand-search-btn,
.expand-tag-panel-btn,
.expand-category-btn {
  padding: 12px 15px;
  margin-left: 0;
}

@media screen and (max-width: 756px){
  .header {
    gap: 0.5rem;
  }
  .left {
    gap: 0.5rem;
    transition: 1s all;
  }
  .right {
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
  }

  .mobile-hidden-header {
    display: none;
  }

  .title {
    display: none;
  }
}

@media screen and (min-width: 768px) {
  .expand-search-btn {
    display: none;
  }
}

@media screen and (min-width: 1025px) {
  .expand-category-btn,
  .expand-tag-panel-btn {
    display: none;
  }
}
</style>