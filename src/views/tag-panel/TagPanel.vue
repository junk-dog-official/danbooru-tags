<script setup lang="ts">
import {ElScrollbar} from "element-plus";
import {ElButtonGroup} from "element-plus";
import {ElButton} from "element-plus";
import {ElMessageBox} from "element-plus";
import CartTree from "@/views/tag-panel/CartTree.vue";
import {useCartStore} from "@/store/cart.ts";
import ExportDialog from "@/views/tag-panel/ExportDialog.vue";
import {ref} from "vue";

const cartStore = useCartStore()

const exportVisible = ref(false)
const importVisible = ref(false)

async function clearDialog() {
  await ElMessageBox.confirm('确定要清空标签面板吗?', '清空提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  cartStore.clear()
}
</script>

<template>
<div class="tag-panel">
  <div class="title panel-title">标签面板</div>
  <ElScrollbar class="scrollable">
    <div class="positive-container">
      <div class="title sub-title">正向提示词</div>
      <CartTree :direction="'positive'"/>
    </div>
    <div class="negative-container">
      <div class="title sub-title">反向提示词</div>
      <CartTree direction="negative" />
    </div>
  </ElScrollbar>
  <div class="btn-container">
    <ElButtonGroup class="btn-group">
      <ElButton type="success" class="btn" disabled>导入标签</ElButton>
      <ElButton type="danger" class="btn" @click="clearDialog">清空</ElButton>
    </ElButtonGroup>
  </div>
  <div class="btn-container">
    <ElButton type="primary" class="btn" @click="importVisible = true">输出结果</ElButton>
  </div>
<ExportDialog v-model="importVisible" />
</div>
</template>

<style scoped lang="scss">
.tag-panel {
  margin: 5px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: calc(100% - 10px);
  min-height: 0;
}

.title {
  font-weight: 600;
}
.panel-title {
  font-size: 16px;
  text-align: center;
  margin: 1rem 0;
}

.sub-title {
  font-size: 14px;
  margin-bottom: 1rem;
}

.scrollable {
  overflow: auto;
  flex: 1;
}

.positive-container, .negative-container {
  margin-bottom: 1.5rem;
}


.btn-container {
  display: block;
  margin-bottom: 1rem;
  width: 100%;

  .btn-group {
    width: 100%;
    > .btn {
      width: 50%;
    }
  }
 > .btn {
   width: 100%;
 }
}
</style>