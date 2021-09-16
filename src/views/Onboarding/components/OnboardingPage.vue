<template>
  <div class="onboarding-container">
    <div class="onboarding-container__header">
      <slot name="header" />
    </div>
    <div :class="classes">
      <slot name="content" />
    </div>
    <slot name="navigation" />
  </div>
</template>

<script>
export default {
  name: 'OnboardingContainer',
  props: {
    withImage: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes() {
      return ['onboarding-container__content', this.withImage ? 'onboarding-container__content--with-image' : '']
    },
  },
}
</script>

<style lang="scss" scoped>
.onboarding-container {
  @apply w-full mx-auto my-0 px-4;

  &__header {
    @apply my-10;
  }

  &__content {
    @apply h-px py-4 w-full bg-white;
    min-height: 450px;
    box-shadow: 4px 4px 14px 4px rgba(103, 71, 128, 0.11);

    &--with-image {
      background: #f6f8fd;
    }
  }

  @media screen and (min-width: 768px) {
    max-width: 1075px;
  }
}
</style>
