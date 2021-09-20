<template>
  <div class="onboarding-container">
    <div class="onboarding-container__header">
      <slot name="header" />
    </div>
    <div :class="classes">
      <div class="w-full">
        <slot name="content" />
      </div>
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
    // @apply h-px p-10 w-full bg-white text-lg; (option with strict height TODO check which option)
    @apply flex items-center justify-center p-10 w-full bg-white text-lg;
    min-height: 500px;
    box-shadow: 4px 4px 14px 4px rgba(103, 71, 128, 0.11);

    --KTableHeaderSize: 18px;

    &--with-image {
      background: #f6f8fd;
    }
  }

  @media screen and (min-width: 768px) {
    max-width: 1075px;
  }
}
</style>
