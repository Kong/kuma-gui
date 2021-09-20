<template>
  <div
    :class="classes"
    @click="$emit('clicked')"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Box',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
    small: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    classes() {
      return [
        'box',
        {
          'box--active': this.active,
          'box--small': this.small,
        },
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.box {
  @apply w-64 h-64 p-12 flex items-center justify-center;

  border: 3px solid #c2c2c2;
  border-radius: 5px;
  box-shadow: 4px 4px 14px 4px rgba(103, 71, 128, 0.11);

  &--active {
    border-color: #7b2bbc;
  }

  &--small {
    @apply w-32 h-40 p-6;
  }
}
</style>
