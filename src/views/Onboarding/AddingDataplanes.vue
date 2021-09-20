<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading title="4. Adding New Services" />
    </template>
    <template #content>
      <div class="h-full w-full flex justify-evenly items-center">
        <Box
          :active="mode === 'demo'"
          class="cursor-pointer"
          @clicked="update('demo')"
        >
          <div>
            <img src="@/assets/images/new-service-demo.svg?external">
            <div class="ml-3">
              <p class="uppercase font-bold tracking-wider">
                Demo app
              </p>
              <p>Pre-Configured</p>
            </div>
          </div>
        </Box>
        <Box
          :active="mode === 'manually'"
          class="cursor-pointer"
          @clicked="update('manually')"
        >
          <div class="cursor-pointer">
            <img src="@/assets/images/new-service-manually.svg?external">
            <div class="ml-3">
              <p class="uppercase font-bold tracking-wider">
                Manually
              </p>
              <p>Custom Config</p>
            </div>
          </div>
        </Box>
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
import Box from '@/views/Onboarding/components/Box'

export default {
  name: 'AddingDataplanes',
  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
    Box,
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
