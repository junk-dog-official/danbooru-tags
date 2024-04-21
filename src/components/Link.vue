<script setup lang="ts">
import {ElLink} from "element-plus";
import {ElTooltip} from "element-plus";
import { faGithubAlt } from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
</script>

<template>
<div class="about">
  <ElTooltip content="Github" :show-after="500">
    <ElLink :underline="false" href="https://github.com/virtualCharacter/danbooru-tags.git" target="_blank">
      <FontAwesomeIcon :icon="faGithubAlt" class="about-icon"/>
    </ElLink>
  </ElTooltip>
</div>
</template>

<style scoped lang="scss">
.about {
  display: inline-flex;
  flex-direction: row;
  gap: 1rem;
}

.about-icon {
  width: 24px;
  height: 24px;
}
</style>