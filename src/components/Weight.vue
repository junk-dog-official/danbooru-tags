<script setup lang="ts">
import Decimal from "decimal.js-light";
import {computed, useCssModule} from "vue";

const props = defineProps<{
  weight: Decimal
}>()

const computedWeight = computed(() => props.weight.toDecimalPlaces(3).toNumber())

const $style = useCssModule()
const color = computed(() => props.weight.gte(1) ? $style['success'] : $style['warning'])
</script>

<template>
<span v-if="computedWeight !== 1" :class="[$style.weight, color]">x{{ computedWeight }}</span>
</template>

<style module lang="scss">
.success {
  color: #4eb183;
}

.warning {
  color: #cc9900;
}

.weight {
  margin-left: 0.2rem;
}
</style>