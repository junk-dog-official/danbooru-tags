<script setup lang="ts">
import {TagDirection, TagItem} from "@/types/cart.ts";
import {ElTree} from "element-plus";
import {useCartStore} from "@/store/cart.ts";
import Node from "element-plus/es/components/tree/src/model/node";
import {NodeDropType} from "element-plus/es/components/tree/src/tree.type";
import CartItem from "@/components/CartItem.vue";

const props = defineProps<{
  direction: TagDirection
}>()

const cartStore = useCartStore()

function allowDrag() {
  return true
}

function allowDrop() {
  return true
}

function nodeDrop(draggingNode: Node, dropNode: Node, type: NodeDropType) {
  if (!dropNode || type === 'none') {
    return
  }
  console.log(type)

  const draggingItem = draggingNode.data as TagItem
  const dropItem = dropNode.data as TagItem
  if (type === 'before' || type === 'after') {
    draggingItem.parent = dropItem.parent
  }
  if (type === 'inner' && dropItem.type === 'group') {
    draggingItem.parent = dropItem
  }
  if (type === 'inner' && dropItem.type === 'tag') {
    cartStore.createTagGroup(props.direction, draggingItem, dropItem)
  }
}
</script>

<template>
<div class="cart">
  <ElTree
      :allow-drag="allowDrag"
      :allow-drop="allowDrop"
      :data="cartStore[direction]"
      draggable
      auto-expand-parent
      @node-drop="nodeDrop">
    <template #default="{ node, data }">
      <CartItem
          :node="node"
          :data="data"
          :direction="direction" />
    </template>
  </ElTree>
</div>
</template>

<style scoped lang="scss">
.el-tree {
  :deep(.el-tree-node__content) {
    height: auto;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }
  :deep(.is-drop-inner) {
    background-color: var(--el-color-primary-light-5);
    color: white;
  }
}
</style>