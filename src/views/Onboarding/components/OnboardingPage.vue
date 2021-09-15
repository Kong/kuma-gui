<template>
  <div class="onboarding-container">
    <div class="onboarding-container__header">
      <slot name="header" />
    </div>
    <div class="onboarding-container__content">
      <slot name="content" />
    </div>
    <slot name="navigation" />
  </div>
</template>

<script>
export default {
  name: 'OnboardingContainer',
}
</script>

<style lang="scss" scoped>
.onboarding-container {
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;

  &__header {
    @apply my-10;
  }

  &__content {
    width: 100%;
    min-height: 450px;
    background: #ffffff;
    box-shadow: 4px 4px 14px 4px rgba(103, 71, 128, 0.11);
  }

  @media screen and (min-width: 768px) {
    max-width: 1075px;
  }
}
</style>
