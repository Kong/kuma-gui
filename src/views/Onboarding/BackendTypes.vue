<template>
  <div class="container mx-auto">
    <div>
      <OnboardingHeading
        title="Backend Types"
        :description="`${title}, is a portable service mesh that can run on both Kubernetes, VMs or other containerized enviroments. You can also mix together different runtimes in a multi one deployment.`"
      />
      <div class="md:w-4/5 lg:w-3/5 mx-auto">
        <component :is="currentGraph" />
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
          Memoty
        </KRadio>
      </div>
    </div>
    <OnboardingNavigation
      next-step="onboarding-populating-mesh"
      previous-step="onboarding-introduction"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MultiZoneDeploymentGraph from '@/views/Onboarding/components/MultiZoneDeploymentGraph'
import StandaloneDeploymentGraph from '@/views/Onboarding/components/StandaloneDeploymentGraph'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'

export default {
  name: 'BackendTypes',
  components: {
    MultiZoneDeploymentGraph,
    StandaloneDeploymentGraph,
    OnboardingNavigation,
    OnboardingHeading
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
    }

  },
}
</script>

<style scoped></style>
