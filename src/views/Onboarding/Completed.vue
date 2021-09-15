<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading
        title="Go to the dashboard"
        description="You have completed the initial wizard! You can now visualize the dashboard were you can find:"
      />
    </template>
    <template #content>
      <div>
        <div class="justify-between flex my-4">
          <div class="w-24 h-24 justify-center items-center flex border border-gray-500">
            Option
          </div>
          <div class="w-24 h-24 justify-center items-center flex border border-gray-500">
            Option
          </div>
          <div class="w-24 h-24 justify-center items-center flex border border-gray-500">
            Option
          </div>
          <div class="w-24 h-24 justify-center items-center flex border border-gray-500">
            Option
          </div>
          <div class="w-24 h-24 justify-center items-center flex border border-gray-500">
            Option
          </div>
        </div>
      </div>
    </template>

    <template #navigation>
      <OnboardingNavigation
        simple-view
        simple-view-next-button-text="View Dashboard"
        next-step="global-overview"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'

export default {
  name: 'Completed',
  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
  },
}
</script>
