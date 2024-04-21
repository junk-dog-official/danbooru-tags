<script setup lang="ts">
import {ElTooltip} from "element-plus";
import {ElSwitch} from "element-plus";
import {useSettingsStore} from "@/store/settings.ts";
import {Sunny} from "@element-plus/icons-vue";
import {Moon} from "@element-plus/icons-vue";
import {isDark} from "@/utils/dark.ts";

const settings = useSettingsStore()
</script>

<template>
<div class="settings">
  <ElTooltip content="暗黑主题" :show-after="500">
    <ElSwitch
        v-model="isDark"
        size="large"
        inline-prompt
        :active-icon="Moon"
        :inactive-icon="Sunny" />
  </ElTooltip>
  <ElTooltip content="分级限制" :show-after="500">
    <ElSwitch
        v-model="settings.showRestricted"
        size="large"
        inline-prompt
        class="restricted-btn"/>
  </ElTooltip>
</div>
</template>

<style scoped lang="scss">
.settings {
  display: inline-flex;
  gap: 1rem;
  flex-direction: row;
}

.restricted-btn {
  --el-switch-on-color: var(--el-color-danger);
  --el-switch-off-color: var(--el-color-success)
}
</style>