<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading
        :title="title"
        :description="description"
      />
    </template>
    <template #content>
      <div>
        <div class="justify-center flex my-4">
          <KIcon
            v-if="!getDataplanesList.length"
            data-testid="loading"
            icon="spinner"
            color="rgba(0, 0, 0, 0.2)"
            size="42"
          />

          <div v-else>
            <p class="text-sm font-bold tracking-wide">
              Found {{ getDataplanesList.length }} DPPs, including:
            </p>
            <KTable :options="tableData">
              <template v-slot:status="{ rowValue }">
                <div
                  class="entity-status"
                  :class="{ 'is-offline': (rowValue.toLowerCase() === 'offline' || rowValue === false) }"
                >
                  <span class="entity-status__dot" />
                  <span class="entity-status__label">{{ rowValue }}</span>
                </div>
              </template>
            </KTable>
          </div>
        </div>
      </div>
    </template>

    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-completed"
        previous-step="onboarding-adding-dpp-code"
        :should-display-next="getDataplanesList.length > 0"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'

export default {
  name: 'DataplanesOverview',
  components: {
    OnboardingNavigation,
    OnboardingHeading,
    OnboardingPage,
  },
  computed: {
    ...mapGetters(['getDataplanesList']),
    tableData() {
      return {
        headers: [
          { label: 'Status', key: 'status' },
          { label: 'Name', key: 'name' },
          { label: 'Mesh', key: 'mesh' },
        ],
        data: this.getDataplanesList,
      }
    },
    title() {
      if (this.getDataplanesList.length) {
        return 'Congratulations!'
      }

      return 'Waiting for DPPs'
    },
    description() {
      if (this.getDataplanesList.length) {
        return 'We have detected the following DPPs (dta plane proxies) connecting to this control plane'
      }

      return null
    },
  },
  watch: {
    getDataplanesList: debounce(function (val) {
      if (!val.length) {
        this.getAllDataplanes({ size: 10 })
      }
    }, 1000),
  },
  created() {
    this.getAllDataplanes({ size: 10 })
  },
  methods: {
    ...mapActions(['getAllDataplanes']),
  },
}
</script>
