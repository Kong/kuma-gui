<template>
  <div class="onboarding-container">
    <div class="min-h-96">
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

  @media screen and (min-width: 768px) {
    max-width: 1075px;
  }
}
</style>
