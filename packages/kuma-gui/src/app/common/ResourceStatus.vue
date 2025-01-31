<template>
  <DefinitionCard>
    <template
      v-if="slots.icon"
      #icon
    >
      <slot name="icon" />
    </template>

    <template #title>
      <slot name="title" />
    </template>

    <template #body>
      <XLayout type="separated">
        <div class="status">
          <template v-if="typeof props.online !== 'undefined'">
            <span
              :class="{ ['text-neutral']: props.online !== props.total }"
            >{{ props.online }}</span><span class="status-separator">/</span>
          </template><span>{{ props.total }}</span>
        </div>
      </XLayout>
    </template>
  </DefinitionCard>
</template>

<script lang="ts" setup>
import DefinitionCard from './DefinitionCard.vue'

const props = withDefaults(defineProps<{
  total: number
  online?: number
}>(), {
  online: undefined,
})
const slots = defineSlots()
</script>

<style lang="scss" scoped>
.text-neutral {
  color: #{$kui-color-text-neutral};
}
</style>
