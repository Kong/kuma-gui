<template>
  <div class="container mx-auto">
    <div class="min-h-96">
      <OnboardingHeading
        title="Deployment Types"
        :description="
          `To get started with ${title}, we must first take a look at a few basic concepts.`
        "
      />
      <div class="md:w-4/5 lg:w-3/5 mx-auto">
        <HoverableSvgWrapper>
          <component :is="currentGraph" />
        </HoverableSvgWrapper>
        <KRadio v-model="mode" name="mode" value="standalone">
          Standalone Deployment
        </KRadio>
        <KRadio v-model="mode" name="mode" value="multi-zone">
          Multi-Zone deployment
        </KRadio>
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
import MultiZoneDeploymentGraph from '@/views/Onboarding/components/MultiZoneDeploymentGraph'
import StandaloneDeploymentGraph from '@/views/Onboarding/components/StandaloneDeploymentGraph'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import HoverableSvgWrapper from '@/views/Onboarding/components/HoverableSvgWrapper'

export default {
  name: 'DeploymentTypes',
  components: {
    MultiZoneDeploymentGraph,
    StandaloneDeploymentGraph,
    OnboardingNavigation,
    OnboardingHeading,
    HoverableSvgWrapper,
  },
  data() {
    return { mode: 'standalone' }
  },
  computed: {
    ...mapGetters({
      title: 'config/getTagline',
    }),
    currentGraph() {
      return this.mode === 'standalone'
        ? 'StandaloneDeploymentGraph'
        : 'MultiZoneDeploymentGraph'
    },
  },
}
</script>
