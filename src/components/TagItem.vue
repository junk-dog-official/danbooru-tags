<script setup lang="ts">
import {ElCard} from "element-plus";
import {ElTooltip} from "element-plus";
import {ElButton} from "element-plus";
import {ElLink} from "element-plus";
import {CopyDocument} from "@element-plus/icons-vue";
import {Link} from "@element-plus/icons-vue";
import {Tag} from "@/types/tag.ts";
import TagPostCount from "@/components/TagPostCount.vue";
import { useClipboard } from '@vueuse/core'
import {computed} from "vue";
import {faThumbsUp} from "@fortawesome/free-regular-svg-icons";
import {faThumbsDown} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useCartStore} from "@/store/cart.ts";

const props = withDefaults(defineProps<{
  tag: Tag,
  showCategory?: boolean
}>(), {
  showCategory: false,
})

const cartStore = useCartStore()

const tagKey = computed(() => props.tag.key)
const { copy, copied } = useClipboard({ source: tagKey })
const inPositive = computed(() => cartStore.positiveExisted(tagKey.value))
const inNegative = computed(() => cartStore.negativeExisted(tagKey.value))

interface BooleanFlag {
  [key: string]: boolean
}

const aliasInPositive = computed(() => {
  return props.tag.alias?.reduce(
      (a: BooleanFlag, t: string) => {
        a[t] = cartStore.positiveExisted(t)
        return a
      },
      {}
  )
})

const aliasInNegative = computed(() => {
  return props.tag.alias?.reduce(
      (a: BooleanFlag, t: string) => {
        a[t] = cartStore.negativeExisted(t)
        return a
      },
      {}
  )
})

function togglePositive(tag: string) {
  if (cartStore.positiveExisted(tag)) {
    cartStore.removePositiveTag(tag)
  } else  {
    cartStore.appendPositiveTag(tag)
  }
}

function toggleNegative(tag: string) {
  if (cartStore.negativeExisted(tag)) {
    cartStore.removeNegativeTag(tag)
  } else {
    cartStore.appendNegativeTag(tag)
  }
}

</script>

<template>
<ElCard class="box-card">
  <div class="card-header flex-button-container">
    <div class="header-left">
      <code class="tag-key large">{{ tag.key }}</code>
      <TagPostCount :tag="tag.key" />
    </div>
    <div class="buttons">
      <ElTooltip :visible="copied">
        <template #content>
          <span>已复制到剪切板</span>
        </template>
        <ElButton type="primary" circle @click="copy()" :icon="CopyDocument" />
      </ElTooltip>
      <ElLink v-if="tag.wikiURL" :underline="false" :href="tag.wikiURL" target="_blank">
        <ElTooltip content="Danbooru Wiki" :show-after="500">
          <ElButton type="info" circle :icon="Link"/>
        </ElTooltip>
      </ElLink>
      <ElTooltip content="正向提示词" :show-after="500">
        <ElButton
            :type="inPositive ? 'success' : 'default'"
            circle
            @click="togglePositive(tag.key)">
          <FontAwesomeIcon :icon="faThumbsUp" />
        </ElButton>
      </ElTooltip>
      <ElTooltip content="反向提示词" :show-after="500">
        <ElButton
            :type="inNegative ? 'danger' : 'default'"
            circle
            @click="toggleNegative(tag.key)">
          <FontAwesomeIcon :icon="faThumbsDown" />
        </ElButton>
      </ElTooltip>
    </div>
  </div>
  <div class="tag-name">{{ tag.name }}</div>
  <div v-if="showCategory" class="tag-category">类别：{{ tag.category.join('/') }}</div>
  <div v-if="tag.alias">
    <div>别名：</div>
    <ul>
      <li
          v-for="alias in tag.alias"
          :key="alias"
          class="alias-tag">
        <div class="flex-button-container">
          <div>
            <code class="tag-key alias-key">{{ alias }}</code>
          </div>
          <div class="buttons">
            <ElTooltip content="正向提示词" :show-after="500">
              <ElButton
                  size="small"
                  :type="aliasInPositive![alias] ? 'success' : 'default'"
                  circle
                  @click="togglePositive(alias)">
                <FontAwesomeIcon :icon="faThumbsUp" />
              </ElButton>
            </ElTooltip>
            <ElTooltip content="反向提示词" :show-after="500">
              <ElButton
                  size="small"
                  :type="aliasInNegative![alias] ? 'danger' : 'default'"
                  circle
                  @click="toggleNegative(alias)">
                <FontAwesomeIcon :icon="faThumbsDown" />
              </ElButton>
            </ElTooltip>
          </div>
        </div>
      </li>
    </ul>
  </div>
</ElCard>
</template>

<style scoped lang="scss">
.box-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.card-header {
  margin-bottom: 1.5rem;
  row-gap: 0.75rem;
}

.flex-button-container {
  display: inline-flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
}

.header-left {
  height: 32px;
  margin-right: 0.75rem;
  line-height: 32px;
}

.tag-key {
  user-select: unset;
  font-size: 12pt;
  font-weight: bold;
  font-family: Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  margin-right: 0.75rem;
}

.buttons {
  display: inline-flex;
  flex-direction: row;
  margin-left: auto;
  & > * {
    margin-left: .6rem;
  }
}

.tag-name, .tag-category {
  margin-bottom: 1rem;
  font-size: 12pt;
  font-weight: 400;
}

.alias-tag {
  margin-bottom: 0.75rem;
}

.alias-key {
  font-weight: 400;
}
</style>