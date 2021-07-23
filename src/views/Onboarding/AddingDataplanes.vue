<template>
  <div class="container mx-auto">
    <div>
      <OnboardingHeading
        title="Adding new DPPs"
      />
      <div class="md:w-4/5 lg:w-3/5 mx-auto">
        <FormFragment
          all-inline
          equal-cols
          hide-label-col
        >
          <label for="demo">
            <input
              id="demo"
              v-model="mode"
              class="k-input"
              type="radio"
              name="k8s-services"
              value="demo"
              checked
            >
            <span>
              Demo application
            </span>
          </label>
          <label for="manual">
            <input
              id="manual"
              v-model="mode"
              class="k-input"
              type="radio"
              name="k8s-services"
              value="manual"
            >
            <span>
              Manually
            </span>
          </label>
        </FormFragment>
      </div>
    </div>
    <OnboardingNavigation
      next-step="onboarding-adding-dpp-code"
      previous-step="onboarding-populating-mesh"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import FormFragment from '@/views/Wizard/components/FormFragment'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'

export default {
  name: 'AddingDataplanes',
  components: {
    FormFragment,
    OnboardingNavigation,
    OnboardingHeading
  },
  computed: {
    ...mapGetters({
      onboardingMode: 'onboarding/getMode',
    }),
    mode: {
      get () {
        return this.onboardingMode
      },
      set (value) {
        this.update(value)
      }
    }
  },
  methods: {
    ...mapMutations({
      update: 'onboarding/UPDATE_MODE',
    }),
  }
}
</script>

<style scoped></style>
