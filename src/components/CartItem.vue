<script setup lang="ts">
import Node from "element-plus/es/components/tree/src/model/node";
import {TagDirection, TagItem} from "@/types/cart.ts";
import Weight from "@/components/Weight.vue";
import {ElTooltip} from "element-plus";
import {ElButton} from "element-plus";
import {CirclePlus, Delete, Remove} from "@element-plus/icons-vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faThumbsDown, faThumbsUp} from "@fortawesome/free-regular-svg-icons";
import {useCartStore} from "@/store/cart.ts";

const props = defineProps<{
  node: Node,
  data: TagItem,
  direction: TagDirection
}>()
const cartStore = useCartStore()

function deleteItem(tagItem: TagItem) {
  cartStore.removeTagItem(props.direction, tagItem)
}

function sendTo(direction: TagDirection, tagItem: TagItem) {
  const revDirection = direction === 'positive' ? 'negative' : 'positive'
  cartStore.removeTagItem(revDirection, tagItem)
  cartStore.appendTagItem(direction, tagItem)
}

function adjustWeight(delta: number) {
  props.data.weight = props.data.weight.add(0.05 * delta)
}
</script>

<template>
<div class="cart-item">
  <div class="tag-label">
    <span class="tag-name">{{ node.label }}</span>
    <Weight :weight="data.weight" />
  </div>
  <div class="tag-buttons">
    <ElTooltip content="提高权重" :show-after="500">
      <ElButton
          link
          type="primary"
          :icon="CirclePlus"
          @click.stop="adjustWeight(1)"/>
    </ElTooltip>
    <ElTooltip content="减少权重" :show-after="500">
      <ElButton
          link
          type="primary"
          :icon="Remove"
          @click.stop="adjustWeight(-1)"/>
    </ElTooltip>
    <ElTooltip
        v-if="direction === 'negative'"
        content="转为正向"
        :show-after="500">
      <ElButton
          link
          type="primary"
          @click.stop="sendTo('positive', data)">
        <FontAwesomeIcon :icon="faThumbsUp" />
      </ElButton>
    </ElTooltip>
    <ElTooltip
        v-if="direction === 'positive'"
        content="转为反向"
        :show-after="500">
      <ElButton
          link
          type="primary"
          @click.stop="sendTo('negative', data)">
        <FontAwesomeIcon :icon="faThumbsDown" />
      </ElButton>
    </ElTooltip>
    <ElTooltip content="删除" :show-after="500">
      <ElButton
          link
          type="danger"
          :icon="Delete"
          @click.stop="deleteItem(data)" />
    </ElTooltip>
  </div>
</div>
</template>

<style scoped lang="scss">
.cart-item {
  position: relative;
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
}

.tag-label {
  margin-right: .2rem;
}

.tag-name {
  margin-right: .1rem;
  max-width: 160px;
  white-space: normal;
}

.tag-buttons {
  margin-left: 0.25rem;
  > * {
    margin-left: 0.25rem;
  }
}
</style>