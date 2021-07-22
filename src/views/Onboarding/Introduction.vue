<template>
  <div class="container mx-auto">
    <div>
      <OnboardingHeading
        title="Introduction"
        :description="`To get started with ${title}, we must first take a look at a few basic concepts.`"
      />
      <div class="md:w-4/5 lg:w-3/5 mx-auto">
        <component :is="currentGraph" />
        <FormFragment
          all-inline
          equal-cols
          hide-label-col
        >
          <label for="standalone">
            <input
              id="standalone"
              v-model="mode"
              class="k-input"
              type="radio"
              name="k8s-services"
              value="standalone"
              checked
            >
            <span>
              Standalone Deployment
            </span>
          </label>
          <label for="multi-zone">
            <input
              id="multi-zone"
              v-model="mode"
              class="k-input"
              type="radio"
              name="k8s-services"
              value="multi-zone"
            >
            <span>
              Multi-Zone deployment
            </span>
          </label>
        </FormFragment>
      </div>
    </div>

    <OnboardingNavigation
      next-step="onboarding-backend-types"
      previous-step="onboarding-welcome"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FormFragment from '@/views/Wizard/components/FormFragment'
import MultiZoneDeploymentGraph from '@/views/Onboarding/components/MultiZoneDeploymentGraph'
import StandaloneDeploymentGraph from '@/views/Onboarding/components/StandaloneDeploymentGraph'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'

export default {
  name: 'Introduction',
  components: {
    FormFragment,
    MultiZoneDeploymentGraph,
    StandaloneDeploymentGraph,
    OnboardingNavigation,
    OnboardingHeading
  },
  data() {
    return { mode: 'standalone' }
  },
  computed: {
    ...mapGetters({
      title: 'config/getTagline',
    }),
    currentGraph() {
      return this.mode === 'standalone' ? 'StandaloneDeploymentGraph' : 'MultiZoneDeploymentGraph'
    }

  },
}
</script>

<style scoped>

</style>
