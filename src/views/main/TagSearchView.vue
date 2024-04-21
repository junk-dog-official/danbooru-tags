<script setup lang="ts">
import {useTagStore} from "@/store/tags.ts";
import {computed, ref, toRef, watch} from "vue";
import {ElScrollbar} from "element-plus";
import {Tag} from "@/types/tag.ts";
import TagItem from "@/components/TagItem.vue";

const tagStore = useTagStore()

const props = defineProps<{
  search: string
}>()

const paginationSize = ref(20)

const scrollRef = ref<typeof ElScrollbar | null>(null)
const filteredTags = computed<Tag[]>(() => tagStore.searchTags(props.search))
const filteredLength = computed(() => filteredTags.value.length)
const paginatedTags = computed<Tag[]>(() =>
    filteredTags.value.slice(0, paginationSize.value)
)

watch(toRef(props, 'search'), () => {
  paginationSize.value = 20
  scrollRef.value?.scrollTo({ top: 0 })
})

function loadMore() {
  paginationSize.value += 20
}
</script>

<template>
  <div class="tag-search-view">
    <ElBreadcrumb separator="/" class="breadcrumb-header">
      <ElBreadcrumbItem>搜索结果</ElBreadcrumbItem>
    </ElBreadcrumb>

    <ElScrollbar ref="scrollRef" class="scroll">
      <div
          class="masonry"
          v-infinite-scroll="loadMore"
          :infinite-scroll-disabled="paginationSize >= filteredLength"
          :infinite-scroll-delay="10"
          :infinite-scroll-distance="512">
        <TagItem
            v-for="tag in paginatedTags"
            :tag="tag"
            :key="tag.key"/>
      </div>
    </ElScrollbar>

  </div>
</template>

<style scoped lang="scss">
.tag-search-view {
  position: relative;
  height: 100%;
}

.breadcrumb-header {
  display: block;
}

.scroll {
  height: calc(100% - 40px);
}
</style>