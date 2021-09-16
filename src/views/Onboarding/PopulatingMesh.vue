<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading title="3. Populating a Mesh" />
    </template>
    <template #content>
      <div class="flex justify-center">
        <div class="w-full lg:w-3/5 py-4">
          <KTable
            :options="tableData"
            is-small
          />
        </div>
      </div>
      <p class="text-center">
        By default, {{ title }} creates a "default" mesh that is ready to use, let's add some DPPs to it in the next step
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
          { label: '# of DPPs', key: 'number' },
        ],
        data: [{ name: 'default', number: 0 }],
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
