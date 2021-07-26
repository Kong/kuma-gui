<template>
  <div class="container mx-auto">
    <div>
      <OnboardingHeading
        title="Adding new DPPs"
      />
      <div class="md:w-4/5 lg:w-3/5 mx-auto">
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
    </div>
    <OnboardingNavigation
      next-step="onboarding-adding-dpp-code"
      previous-step="onboarding-populating-mesh"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'

export default {
  name: 'AddingDataplanes',
  components: {
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
