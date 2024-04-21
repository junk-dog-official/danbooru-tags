<script setup lang="ts">
import {ElDialog} from "element-plus";
import {ElInput} from "element-plus";
import {ElButton} from "element-plus";
import {ElTooltip} from "element-plus";
import {computed} from "vue";
import {useClipboard} from "@vueuse/core";
import {useCartStore} from "@/store/cart.ts";

const props = defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits(['update:modelValue'])
const cartStore = useCartStore()

const visible = computed({
  get: () => props.modelValue,
  set: newValue => emits('update:modelValue', newValue)
})

const { copied: positiveCopied, copy: copyPositive } = useClipboard({
  source: computed(() => cartStore.positiveToString)
})

const { copied: negativeCopied, copy: copyNegative } = useClipboard({
  source: computed(() => cartStore.negativeToString)
})
</script>

<template>
<ElDialog v-model="visible" title="输出结果" width="50%">
  <div class="tag-positive">
    <div class="title">正向标签</div>
    <ElTooltip :visible="positiveCopied">
      <template #content>
        <span>已复制到剪切板</span>
      </template>
      <ElInput
          class="tag-pre"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 8 }"
          readonly
          v-model="cartStore.positiveToString"
          @dblclick="copyPositive()" />
    </ElTooltip>
  </div>
  <div class="tag-negative">
    <div class="title">反向标签</div>
    <ElTooltip :visible="negativeCopied">
      <template #content>
        <span>已复制到剪切板</span>
      </template>
      <ElInput
          class="tag-pre"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 8 }"
          readonly
          v-model="cartStore.negativeToString"
          @dblclick="copyNegative()" />
    </ElTooltip>
  </div>
  <template #footer>
    <div class="dialog-footer">
      <ElButton @click="visible = false">关闭</ElButton>
    </div>
  </template>
</ElDialog>
</template>

<style scoped lang="scss">
.tag-positive, .tag-negative {
  margin-bottom: 3rem;
  font-family: Consolas, 'Liberation Mono', Menlo, Courier, monospace;
}

.title {
  font-size: 14pt;
  margin-bottom: 1.5rem;
}
</style>