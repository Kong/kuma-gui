<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading title="4. Adding New Services" />
    </template>
    <template #content>
      <div class="h-full w-full flex justify-center items-center">
        <DemoOption
          class="mr-24"
          type="demo"
          :active="mode === 'demo'"
          title="Demo app"
          sub-title="Pre-Configured"
          @clicked="update('demo')"
        />
        <DemoOption
          type="manually"
          :active="mode === 'manually'"
          title="Manually"
          sub-title="Custom Config"
          @clicked="update('manually')"
        />
      </div>
    </template>
    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-adding-dpp-code"
        previous-step="onboarding-populating-mesh"
      >
        <template #selector>
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
            value="manually"
          >
            Manually
          </KRadio>
        </template>
      </OnboardingNavigation>
    </template>
  </OnboardingPage>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'
import DemoOption from '@/views/Onboarding/components/DemoOption'

export default {
  name: 'AddingDataplanes',
  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
    DemoOption,
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
