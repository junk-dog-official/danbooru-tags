<script setup lang="ts">
import {ElMenu} from "element-plus";
import {ElSubMenu} from "element-plus";
import {ElIcon} from "element-plus";
import {ElMenuItem} from "element-plus";
import {Document} from "@element-plus/icons-vue";
import {Collection} from "@element-plus/icons-vue";
import SideBarItem from "@/views/sidebar/SideBarItem.vue";
import {useTagStore} from "@/store/tags.ts";

const emits = defineEmits(['select']);

function select(_: string, indexPath: string[]) {
  emits('select', indexPath)
}

const tags = useTagStore()
</script>

<template>
<div class="sidebar">
  <ElMenu
      class="borderless"
      :default-openeds="['tags']"
      @select="select">
    <ElMenuItem index="about">
      <ElIcon>
        <Document />
      </ElIcon>
      关于
    </ElMenuItem>
    <ElSubMenu index="tags">
      <template #title>
        <ElIcon>
          <Collection />
        </ElIcon>
        标签
      </template>
      <SideBarItem :hierarchy="tags.categoryHierarchy"/>
    </ElSubMenu>
  </ElMenu>
</div>
</template>

<style scoped lang="scss">
.sidebar {
  height: 100%;
}

.borderless {
  border-right: unset;
}
</style>