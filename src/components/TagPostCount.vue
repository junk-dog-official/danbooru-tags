<script setup lang="ts">
import {useTagStore} from "@/store/tags.ts";
import {computed, useCssModule} from "vue";

const props = defineProps<{
  tag: string
}>()

const tagStore = useTagStore()
const $style = useCssModule()

const rawCount = computed(() => tagStore.tagsPostCount[props.tag] ?? 0)
const humanizedCount = computed(() => {
  if (rawCount.value === 0) {
    return 'N/A'
  } else if (rawCount.value < 10_000) {
    return rawCount.value
  } else if (rawCount.value < 10_000_000) {
    return `${Math.floor(rawCount.value / 1000)}k`
  } else if (rawCount.value < 10_000_000_000) {
    return `${Math.floor(rawCount.value / 1_000_000)}m`
  } else {
    return `${Math.floor(rawCount.value / 1_000_000_000)}b`
  }
})

const className = computed(() => {
  if (rawCount.value < 100) {
    return [$style['tag-post-count']]
  } else if (rawCount.value < 10_000) {
    return [$style['tag-post-count'], $style['kilo']]
  } else if (rawCount.value < 10_000_000) {
    return [$style['tag-post-count'], $style['mil']]
  } else {
    return [$style['tag-post-count'], $style['bil']]
  }
})
</script>

<template>
<div :class="className"><{{ humanizedCount }}></div>
</template>

<style module lang="scss">
.tag-post-count {
  display: inline-flex;
  font-family: Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  font-weight: 200;
  user-select: none;
}

.tag-post-count {
  color: #495057;
  &.kilo {
    color: #997404;
  }
  &.mil {
    color: #984c04;
  }
  &.bil {
    color: #842029;
  }
}

:global(html.dark) .tag-post-count {
  color: #dee2e6;
  &.kilo {
    color: #ffda6a;
  }
  &.mil {
    color: #feb272;
  }
  &.bil {
    color: #ea868f;
  }
}
</style>