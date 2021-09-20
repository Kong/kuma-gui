<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading title="3. Populating a Mesh" />
    </template>
    <template #content>
      <p class="text-center">
        {{ title }} is a multi-tenant system that can support multiple service meshes in the same cluster:
      </p>
      <div class="flex justify-center mt-10 mb-16 pb-16">
        <div class="w-full sm:w-3/5 lg:w-2/5 p-4">
          <KTable
            :options="tableData"
            is-small
          />
        </div>
      </div>
      <p class="text-center">
        {{ title }} automatically creates a “default” mesh that’s ready-to-use. Let’s add services next.
      </p>
    </template>

    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-adding-dpp"
        previous-step="onboarding-backend-types"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import { mapGetters } from 'vuex'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'

export default {
  name: 'PopulatingMesh',
  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
  },
  data() {
    return {
      tableData: {
        headers: [
          { label: 'Name', key: 'name' },
          { label: 'Services', key: 'servicesAmount' },
          { label: 'DPPs', key: 'dppsAmount' },
        ],
        data: [{ name: 'default', servicesAmount: 0, dppsAmount: 0 }],
      },
    }
  },
  computed: {
    ...mapGetters({
      title: 'config/getTagline',
    }),
  },
}
</script>
