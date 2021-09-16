<template>
  <div class="mt-4 flex justify-between items-center">
    <KButton
      v-show="previousStep"
      class="mr-4"
      appearance="secondary"
      :to="{
        name: previousStep,
      }"
      @click.native="changeStep(previousStep)"
    >
      Back
    </KButton>

    <div
      v-if="$slots.selector"
      class="radio flex justify-between w-3/5 md:w-1/2 lg:w-2/5"
    >
      <slot name="selector" />
    </div>

    <KButton
      v-if="shouldDisplayNext"
      class="next-button"
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
    shouldDisplayNext: {
      type: Boolean,
      default: true,
    },
    nextStep: {
      type: String,
      required: true,
    },
    previousStep: {
      type: String,
      default: '',
    },
  },
  methods: {
    ...mapActions('onboarding', ['completeOnboarding', 'changeStep']),
  },
}
</script>

<style lang="scss" scoped>
.next-button {
  --KButtonPrimaryBase: #5da46f;
  --KButtonPrimaryHover: #5da46f;
  --KButtonPrimaryActive: #5da46f;
}

.radio {
  --KRadioPrimary: #5da46f;
  color: #5da46f;
}
</style>
