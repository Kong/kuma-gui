<template>
  <div class="container mx-auto">
    <div class="min-h-96">
      <OnboardingHeading
        title="Go to the dashboard"
        description="You have completed the initial wizard! You can now visualize the dashboard were you can find:"
      />
      <div class="md:w-4/5 lg:w-3/5 mx-auto">
        <div class="justify-center flex my-4">
          <KIcon
            icon="spinner"
            color="rgba(0, 0, 0, 0.2)"
            size="42"
          />
        </div>
      </div>
    </div>
    <OnboardingNavigation
      hide-skip
      simple-view
      simple-view-next-button-text="View Dashboard"
      next-step="global-overview"
    />
  </div>
</template>

<script>
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'

export default {
  name: 'Completed',
  components: {
    OnboardingNavigation,
    OnboardingHeading
  }
}
</script>
