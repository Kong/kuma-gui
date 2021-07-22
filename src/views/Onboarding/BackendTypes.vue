<template>
  <div class="container mx-auto">
    <div>
      <OnboardingHeading
        title="Backend Types"
        :description="`${title}, is a portable service mesh that can run on both Kubernetes, VMs or other containerized enviroments. You can also mix together different runtimes in a multi one deployment.`"
      />
      <div class="md:w-4/5 lg:w-3/5 mx-auto">
        <component :is="currentGraph" />
        <FormFragment
          all-inline
          equal-cols
          hide-label-col
        >
          <label for="Kubernetess">
            <input
              id="Kubernetess"
              v-model="mode"
              class="k-input"
              type="radio"
              name="k8s-services"
              value="kubernetess"
              checked
            >
            <span>
              Kubernetess Deployment
            </span>
          </label>
          <label for="Universal">
            <input
              id="Universal"
              v-model="mode"
              class="k-input"
              type="radio"
              name="k8s-services"
              value="universal"
            >
            <span>
              Universal deployment
            </span>
          </label>
          <label for="Memory">
            <input
              id="Memory"
              v-model="mode"
              class="k-input"
              type="radio"
              name="k8s-services"
              value="memory"
            >
            <span>
              Memory deployment
            </span>
          </label>
        </FormFragment>
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
import FormFragment from '@/views/Wizard/components/FormFragment'
import MultiZoneDeploymentGraph from '@/views/Onboarding/components/MultiZoneDeploymentGraph'
import StandaloneDeploymentGraph from '@/views/Onboarding/components/StandaloneDeploymentGraph'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'

export default {
  name: 'BackendTypes',
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

<style scoped></style>
