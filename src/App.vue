<script setup lang="ts">
import {ElHeader} from "element-plus";
import {ElContainer} from "element-plus";
import {ElMain} from "element-plus";
import {ElAside} from "element-plus";
import {ElScrollbar} from "element-plus";
import Header from "./views/header/Header.vue";
import {type Component, computed, ref} from "vue";
import SideBar from "@/views/sidebar/SideBar.vue";
import TagView from "@/views/main/TagView.vue";
import About from "@/components/About.vue";
import TagPanel from "@/views/tag-panel/TagPanel.vue";
import TagSearchView from "@/views/main/TagSearchView.vue";

const search = ref("");
const menuIndexPath = ref(['about'])
const categories = computed(
    () => menuIndexPath.value.length > 1
    ? menuIndexPath.value[menuIndexPath.value.length-1].split('/')
    : []
)
const asideExpanded = ref<'category' | 'tagPanel' | null>(null)

interface ComponentMap {
  [key: string]: Component
}

const components: ComponentMap = {
  about: About,
  tags: TagView
}

function menuChange(indexPath: string[]) {
  menuIndexPath.value = indexPath
  search.value = ''
}

function switchAsideExpand(item: 'category' | 'tagPanel' | 'reset') {
  if (item === asideExpanded.value || item === 'reset') {
    asideExpanded.value = null
  } else {
    asideExpanded.value = item
  }
}
</script>

<template>
  <ElContainer class="container-full-height">
    <ElHeader class="header-wrapper">
      <Header
          v-model:search="search"
          @expand-category="switchAsideExpand('category')"
          @expand-tag-panel="switchAsideExpand('tagPanel')"/>
    </ElHeader>
    <ElContainer class="body-wrapper">
      <ElAside width="284px"
               :class="[
                   'container-full-height', 'right-bordered', 'category-aside',
                   { expanded: asideExpanded === 'category' }
                ]">
        <ElScrollbar class="container-full-height">
          <SideBar @select="menuChange"/>
        </ElScrollbar>
      </ElAside>
      <ElMain
          :class="[
              'main-wrapper',
              {'left-expanded': asideExpanded === 'category'},
              {'right-expanded': asideExpanded === 'tagPanel'}
          ]"
          @click="switchAsideExpand('reset')">
        <component
            v-if="!search"
            :is="components[menuIndexPath[0]]"
            :categories="categories" />
        <TagSearchView v-else :search="search" />
      </ElMain>
      <ElAside width="375px" :class="[
          'container-full-height', 'left-bordered', 'tag-panel-aside',
           { expanded: asideExpanded === 'tagPanel' }
          ]">
        <TagPanel />
      </ElAside>
    </ElContainer>
  </ElContainer>
</template>

<style lang="scss" scoped>
.container-full-height {
  height: 100%;
  position: relative;
}

.body-wrapper {
  height: calc(100% - 60px);
  position: relative;
}

.header-wrapper {
  border-bottom: 1px solid var(--el-menu-border-color);
}

.right-bordered {
  border-right: 1px solid var(--el-menu-border-color);
}

.left-bordered {
  border-left: 1px solid var(--el-menu-border-color);
}

.main-wrapper {
  overflow-y: hidden;
}

@media screen and (max-width: 1024px) {
  .category-aside {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(-284px);
    transition: transform 0.3s ease-in-out;
    &.expanded {
      transform: translateX(0);
    }
  }
  .tag-panel-aside {
    position: absolute;
    top: 0;
    right: -375px;
    transition: transform 0.3s ease-in-out;
    transform: translateX(0);
    &.expanded {
      transform: translateX(-375px);
    }
  }
  .main-wrapper {
    transition: transform 0.3s ease-in-out;
  }

  .left-expanded {
    transform: translateX(284px);
  }
  .right-expanded {
    transform: translateX(-375px);
  }
}
</style>
