<template>
  <OnboardingPage>
    <template #content>
      <OnboardingHeading
        title="Deployment Types"
        :description="
          `To get started with ${title}, we must first take a look at a few basic concepts.`
        "
      />

      <HoverableSvgWrapper>
        <component :is="currentGraph" />
      </HoverableSvgWrapper>
      <KRadio
        v-model="mode"
        name="mode"
        value="standalone"
      >
        Standalone Deployment
      </KRadio>
      <KRadio
        v-model="mode"
        name="mode"
        value="multi-zone"
      >
        Multi-Zone deployment
      </KRadio>
    </template>

    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-backend-types"
        previous-step="onboarding-welcome"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import { mapGetters } from 'vuex'
import MultiZoneDeploymentGraph from '@/views/Onboarding/components/MultiZoneDeploymentGraph'
import StandaloneDeploymentGraph from '@/views/Onboarding/components/StandaloneDeploymentGraph'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import HoverableSvgWrapper from '@/views/Onboarding/components/HoverableSvgWrapper'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'

export default {
  name: 'DeploymentTypes',
  components: {
    MultiZoneDeploymentGraph,
    StandaloneDeploymentGraph,
    OnboardingNavigation,
    OnboardingHeading,
    HoverableSvgWrapper,
    OnboardingPage,
  },
  data() {
    return { mode: 'standalone' }
  },

  computed: {
    ...mapGetters({
      title: 'config/getTagline',
      multicluster: 'config/getMulticlusterStatus',
    }),
    currentGraph() {
      return this.mode === 'standalone' ? 'StandaloneDeploymentGraph' : 'MultiZoneDeploymentGraph'
    },
  },
  mounted() {
    this.mode = this.multicluster ? 'multi-zone' : 'standalone'
  },
}
</script>
