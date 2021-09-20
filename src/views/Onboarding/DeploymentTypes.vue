<template>
  <OnboardingPage with-image>
    <template #header>
      <OnboardingHeading
        title="1. Choose Deployment Types"
        :description="
          `${title} is a multi-tenant system that can support multiple service meshes in the same cluster:`
        "
      />
    </template>
    <template #content>
      <div class="h-full w-full flex items-center justify-center">
        <component :is="currentGraph" />
      </div>
    </template>

    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-backend-types"
        previous-step="onboarding-welcome"
      >
        <template #selector>
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
      </OnboardingNavigation>
    </template>
  </OnboardingPage>
</template>

<script>
import { mapGetters } from 'vuex'
import MultizoneGraph from '@/views/Onboarding/components/graphs/MultizoneGraph'
import StandaloneGraph from '@/views/Onboarding/components/graphs/StandaloneGraph'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import HoverableSvgWrapper from '@/views/Onboarding/components/HoverableSvgWrapper'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'

export default {
  name: 'DeploymentTypes',
  components: {
    MultizoneGraph,
    StandaloneGraph,
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
      return this.mode === 'standalone' ? 'StandaloneGraph' : 'MultizoneGraph'
    },
  },
  mounted() {
    this.mode = this.multicluster ? 'multi-zone' : 'standalone'
  },
}
</script>
