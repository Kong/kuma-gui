<template>
  <div
    :class="classes"
    @click="$emit('clicked')"
  >
    <div>
      <img :src="imageUrl">
      <div class="ml-3">
        <p class="uppercase font-bold tracking-wider">
          {{ title }}
        </p>
        <p>{{ subTitle }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemoOption',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
  },

  computed: {
    classes() {
      return ['add-option-box', this.active ? 'add-option-box--active' : '']
    },
    imageUrl() {
      return require(`@/assets/images/new-service-${this.type}.svg?external`)
    },
  },
}
</script>

<style lang="scss" scoped>
.add-option-box {
  @apply w-64 h-64 p-12 cursor-pointer flex items-center justify-center;

  border: 3px solid #c2c2c2;
  border-radius: 5px;
  box-shadow: 4px 4px 14px 4px rgba(103, 71, 128, 0.11);

  &--active {
    border-color: #7b2bbc;
  }
}
</style>
