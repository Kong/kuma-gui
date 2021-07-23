<template>
  <div class="container mx-auto">
    <div>
      <OnboardingHeading
        title="Populating Mesh"
        :description="`${title} is a multi-tenat system that can support multiple service meshes in the same cluster`"
      />
      <div>
        <div class="flex justify-center">
          <div class="w-full lg:w-1/2 py-4">
            <KTable
              :options="tableData"
              is-small
            />
          </div>
        </div>
        <p class="text-center">
          By default, {{ title }} creates a "default" mesg that is ready to use, let's add some DPPs to it in the next step
        </p>
      </div>
    </div>
    <OnboardingNavigation
      next-step="onboarding-adding-dpp"
      previous-step="onboarding-backend-types"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'

export default {
  name: 'PopulatingMesh',
  components: {
    OnboardingNavigation,
    OnboardingHeading
  },
  data() {
    return {
      tableData: {
        headers: [
          { label: 'Name', key: 'name' },
          { label: '# of DPPs', key: 'number' }
        ],
        data: [
          { name: 'default', number: 0 }
        ]
      }
      // if not static then call '/dataplanes'
    }
  },
  computed: {
    ...mapGetters({
      title: 'config/getTagline',
    }),
  },
}

</script>

<style scoped></style>
