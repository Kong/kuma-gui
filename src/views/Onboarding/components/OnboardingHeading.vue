<template>
  <div class="relative">
    <h1 class="onboarding-title">
      {{ title }}
    </h1>
    <p
      v-if="description"
      class="text-center text-lg mt-3"
    >
      {{ description }}
    </p>
    <div class="absolute right-0 top-0 mt-4 m-a flex items-center">
      <KButton
        class="skip-button"
        appearance="btn-link"
        size="small"
        :to="{
          name: 'global-overview',
          params: {
            mesh: 'all',
          },
        }"
        @click.native="completeOnboarding"
      >
        Skip Setup
      </KButton>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'OnboardingHeading',
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  methods: {
    ...mapActions('onboarding', ['completeOnboarding']),
  },
}
</script>

<style lang="scss" scoped>
.onboarding-title {
  @apply text-center text-4xl font-bold;

  background: -webkit-linear-gradient(#260d50, #822dc5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.skip-button {
  @apply font-medium;

  --KButtonBtnLink: rgba(38, 13, 80, 0.3);
}
</style>
