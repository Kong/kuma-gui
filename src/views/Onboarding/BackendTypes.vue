<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading
        title="Backend Types"
        :description="
          `${title}, is a portable service mesh that can run on both Kubernetes, VMs or other containerized enviroments. You can also mix together different runtimes in a multi zone deployment.`
        "
      />
    </template>
    <template #content>
      <HoverableSvgWrapper>
        <component :is="currentGraph" />
      </HoverableSvgWrapper>
      <KRadio
        v-model="mode"
        name="deployment"
        value="kubernetess"
      >
        Kubernetess
      </KRadio>
      <KRadio
        v-model="mode"
        name="deployment"
        value="universal"
      >
        Universal
      </KRadio>
      <KRadio
        v-model="mode"
        name="deployment"
        value="memory"
      >
        Memory
      </KRadio>
    </template>
    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-populating-mesh"
        previous-step="onboarding-deployment-types"
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
  name: 'BackendTypes',
  components: {
    MultiZoneDeploymentGraph,
    StandaloneDeploymentGraph,
    OnboardingNavigation,
    OnboardingHeading,
    HoverableSvgWrapper,
    OnboardingPage,
  },
  data() {
    return { mode: 'kubernetess' }
  },
  computed: {
    ...mapGetters({
      title: 'config/getTagline',
    }),
    currentGraph() {
      return this.mode === 'memory' ? 'StandaloneDeploymentGraph' : 'MultiZoneDeploymentGraph'
    },
  },
}
</script>
