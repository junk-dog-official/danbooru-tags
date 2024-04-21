<script setup lang="ts">
import {CategoryHierarchy} from "@/types/tag.ts";
import {ElSubMenu} from "element-plus";
import {ElMenuItem} from "element-plus";
import {useTagStore} from "@/store/tags.ts";

withDefaults(defineProps<{
  hierarchy: CategoryHierarchy,
  prefix?: string
}>(), {
  prefix: '',
})

const tagStore = useTagStore()
</script>

<template>
  <template v-for="(category, name) in hierarchy" :key="name">
    <ElSubMenu v-if="category !== null" :index="`${prefix}${name}`">
      <template #title>
        {{name}}
      </template>
      <SideBarItem :hierarchy="category" :prefix="`${prefix}${name}/`"/>
    </ElSubMenu>
    <ElMenuItem v-else :index="`${prefix}${name}`">
      <div class="menu-leaf">
        <div class="category-name">{{name}}</div>
        <div class="category-size">{{ tagStore.categorySize[`${prefix}${name}`] || 0 }}</div>
      </div>
    </ElMenuItem>
  </template>
</template>

<style scoped lang="scss">
.menu-leaf {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.category-size {
  font-size: small;
}
</style>