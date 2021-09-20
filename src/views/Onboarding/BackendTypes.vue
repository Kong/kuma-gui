<template>
  <OnboardingPage with-image>
    <template #header>
      <OnboardingHeading title="2. Choose Backend Types" />
    </template>
    <template #content>
      <div class="h-full w-full flex items-center justify-center">
        <component :is="currentGraph" />
      </div>
    </template>
    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-populating-mesh"
        previous-step="onboarding-deployment-types"
      >
        <template #selector>
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
            value="postgres"
          >
            Postgres
          </KRadio>
          <KRadio
            v-model="mode"
            name="deployment"
            value="memory"
          >
            Memory
          </KRadio>
        </template>
      </OnboardingNavigation>
    </template>
  </OnboardingPage>
</template>

<script>
import { mapGetters } from 'vuex'

import KubernetesGraph from '@/views/Onboarding/components/graphs/KubernetesGraph'
import PostgresGraph from '@/views/Onboarding/components/graphs/PostgresGraph'
import MemoryGraph from '@/views/Onboarding/components/graphs/MemoryGraph'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import HoverableSvgWrapper from '@/views/Onboarding/components/HoverableSvgWrapper'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'

export default {
  name: 'BackendTypes',
  components: {
    KubernetesGraph,
    PostgresGraph,
    MemoryGraph,
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
      switch (this.mode) {
        case 'kubernetess':
          return 'KubernetesGraph'
        case 'postgres':
          return 'PostgresGraph'
        case 'memory':
          return 'MemoryGraph'
        default:
          return 'KubernetesGraph'
      }
    },
  },
}
</script>
