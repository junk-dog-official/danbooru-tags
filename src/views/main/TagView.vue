<script setup lang="ts">
import {ElBreadcrumb} from "element-plus";
import {ElBreadcrumbItem} from "element-plus";
import {ElInput} from "element-plus";
import {ElScrollbar} from "element-plus";
import {computed, ref, toRef, watch} from "vue";
import { Search } from "@element-plus/icons-vue";
import TagItem from "@/components/TagItem.vue";
import {useTagStore} from "@/store/tags.ts";
import {Tag} from "@/types/tag.ts";

const tagStore = useTagStore()

const props = defineProps<{
  categories: string[]
}>()

const searchTerms = ref('')
const paginationSize = ref(20)

const scrollRef = ref<typeof ElScrollbar | null>(null)
const filteredTags = computed<Tag[]>(() => tagStore.filterTags(props.categories, searchTerms.value))
const filteredLength = computed(() => filteredTags.value.length)
const paginatedTags = computed<Tag[]>(() =>
    filteredTags.value.slice(0, paginationSize.value)
)

watch([toRef(props, 'categories'), searchTerms], () => {
  paginationSize.value = 20
  scrollRef.value?.scrollTo({ top: 0 })
})

function loadMore() {
  paginationSize.value += 20
}
</script>

<template>
<div class="tag-view">
  <ElBreadcrumb separator="/" class="breadcrumb-header">
    <ElBreadcrumbItem v-for="category in categories">{{ category }}</ElBreadcrumbItem>
  </ElBreadcrumb>
  <ElInput
      class="search-box"
      v-model="searchTerms"
      placeholder="搜索"
      :prefix-icon="Search"/>
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
.tag-view {
  position: relative;
  height: 100%;
}

.search-box {
  margin-bottom: 20px;
}

.scroll {
  height: calc(100% - 120px);
}
</style>