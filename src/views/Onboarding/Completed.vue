<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading
        title="Go to the dashboard"
        description="You have completed the initial wizard! You can now visualize the dashboard were you can find:"
        :show-skip="false"
      />
    </template>
    <template #content>
      <div>
        <div class="justify-between flex my-4">
          <Box
            v-for="item in items"
            :key="item"
            small
          >
            <div class="flex h-full items-end font-bold tracking-wider">
              {{ item }}
            </div>
          </Box>
        </div>
      </div>
    </template>

    <template #navigation>
      <OnboardingNavigation
        next-step="global-overview"
        next-step-title="View Dashboard"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import Box from '@/views/Onboarding/components/Box'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'

export default {
  name: 'Completed',
  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
    Box,
  },
  data() {
    return {
      items: ['MESHES', 'ZONES', 'SERVICES', 'DPPs', 'POLICIES'],
    }
  },
}
</script>
