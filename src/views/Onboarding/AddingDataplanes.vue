<template>
  <OnboardingPage>
    <template #content>
      <OnboardingHeading title="Adding new DPPs" />
      <div>
        <KRadio
          v-model="mode"
          name="deployment"
          value="demo"
        >
          Demo
        </KRadio>
        <KRadio
          v-model="mode"
          name="deployment"
          value="manual"
        >
          Manually
        </KRadio>
      </div>
    </template>
    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-adding-dpp-code"
        previous-step="onboarding-populating-mesh"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'

export default {
  name: 'AddingDataplanes',
  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
  },
  computed: {
    ...mapGetters({
      onboardingMode: 'onboarding/getMode',
    }),
    mode: {
      get() {
        return this.onboardingMode
      },
      set(value) {
        this.update(value)
      },
    },
  },
  methods: {
    ...mapMutations({
      update: 'onboarding/UPDATE_MODE',
    }),
  },
}
</script>
