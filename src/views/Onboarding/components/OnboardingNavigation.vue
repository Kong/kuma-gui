<template>
  <div
    v-if="gettingStarted"
    class="mt-4 flex justify-center"
  >
    <KButton
      class="mr-4"
      appearance="primary"
      :to="{
        name: nextStep,
      }"
      @click.native="changeStep(nextStep)"
    >
      Get Started
    </KButton>
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
      or Skip
    </KButton>
  </div>

  <div
    v-else
    class="mt-4 flex justify-between"
  >
    <div>
      <KButton
        class="mr-4"
        appearance="secondary"
        :to="{
          name: previousStep,
        }"
        @click.native="changeStep(previousStep)"
      >
        Back
      </KButton>
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
        or Skip
      </KButton>
    </div>
    <KButton
      v-if="shouldDisplayNext"
      appearance="primary"
      :to="{
        name: nextStep,
      }"
      @click.native="changeStep(nextStep)"
    >
      Next
    </KButton>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'OnboardingNavigation',
  props: {
    gettingStarted: {
      type: Boolean,
      defalut: false,
    },
    shouldDisplayNext: {
      type: Boolean,
      default: true
    },
    nextStep: {
      type: String,
      required: true,
    },
    previousStep: {
      type: String,
      default: 'onboarding-welcome',
    },
  },
  methods: {
    ...mapActions('onboarding', ['completeOnboarding', 'changeStep']),
  },
}
</script>

<style lang="scss" scoped>
.skip-button {
  --KButtonBtnLink: #000000;
}
</style>
