<template>
  <div :class="classes">
    <KButton
      v-show="previousStep"
      appearance="primary"
      class="navigation-button navigation-button--back"
      :to="{
        name: previousStep,
      }"
      @click.native="changeStep(previousStep)"
    >
      Back
    </KButton>

    <div
      v-if="$slots.selector"
      class="radio flex justify-between w-full sm:w-3/5 md:w-1/2 lg:w-2/5"
    >
      <slot name="selector" />
    </div>

    <KButton
      v-if="shouldDisplayNext"
      class="navigation-button navigation-button--next"
      appearance="primary"
      :to="{
        name: nextStep,
      }"
      @click.native="changeStep(nextStep)"
    >
      {{ nextStepTitle }}
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
    nextStepTitle: {
      type: String,
      default: 'Next',
    },
  },
  computed: {
    classes() {
      return [
        'mt-10 flex items-center flex-col sm:flex-row',
        {
          'justify-between': this.previousStep,
          'justify-end': !this.previousStep,
        },
      ]
    },
  },
  methods: {
    ...mapActions('onboarding', ['completeOnboarding', 'changeStep']),
  },
}
</script>

<style lang="scss" scoped>
.navigation-button {
  @apply text-lg font-bold;

  --KButtonPaddingY: 12px;
  --KButtonPaddingX: 48px;
  --KButtonRadius: 25px;

  &--back {
    color: #646464 !important;
    --KButtonPrimaryBase: #f6f8fd;
    --KButtonPrimaryHover: #{darken(#f6f8fd, 5%)};
    --KButtonPrimaryActive: #{darken(#f6f8fd, 5%)};
  }
  &--next {
    --KButtonPrimaryBase: #5da46f;
    --KButtonPrimaryHover: #{darken(#5da46f, 5%)};
    --KButtonPrimaryActive: #{darken(#5da46f, 5%)};
  }
}

.k-radio {
  --KRadioPrimary: #5da46f;
  color: #5da46f;
}
</style>
