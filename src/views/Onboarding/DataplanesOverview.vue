<template>
  <OnboardingPage>
    <template #header>
      <OnboardingHeading
        :title="title"
        :description="description"
      />
    </template>
    <template #content>
      <div class="justify-center flex my-4">
        <KIcon
          v-if="!tableData.data.length"
          data-testid="loading"
          icon="spinner"
          color="rgba(0, 0, 0, 0.2)"
          size="42"
        />

        <div v-else>
          <p class="font-bold mb-4">
            Found {{ tableData.data.length }} DPPs, including:
          </p>
          <KTable
            :options="tableData"
            is-small
          >
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
    </template>

    <template #navigation>
      <OnboardingNavigation
        next-step="onboarding-completed"
        previous-step="onboarding-adding-dpp-code"
        :should-display-next="tableData.data.length > 0"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import { getItemStatusFromInsight } from '@/dataplane'
import Kuma from '@/services/kuma'
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
  data() {
    return {
      tableData: {
        headers: [
          { label: 'Mesh', key: 'mesh' },
          { label: 'Name', key: 'name' },
          { label: 'Status', key: 'status' },
        ],
        data: [],
      },
    }
  },

  computed: {
    title() {
      if (this.tableData.data.length) {
        return 'Congratulations!'
      }

      return 'Waiting for DPPs'
    },
    description() {
      if (this.tableData.data.length) {
        return 'We have detected the following DPPs (dta plane proxies) connecting to this control plane'
      }

      return null
    },
  },
  watch: {
    'tableData.data': debounce(function (val) {
      if (!val.length) {
        this.getAllDataplanes()
      }
    }, 1000),
  },
  created() {
    this.getAllDataplanes()
  },
  methods: {
    async getAllDataplanes() {
      const result = []

      const dataplanes = await Kuma.getAllDataplanes({ size: 10 })
      const items = dataplanes.items

      for (let i = 0; i < items.length; i++) {
        const itemName = items[i].name
        const itemMesh = items[i].mesh

        const itemStatus = await Kuma.getDataplaneOverviewFromMesh(itemMesh, itemName).then((response) => {
          const { status } = getItemStatusFromInsight(response.dataplaneInsight)

          return status
        })

        // create the full data array
        result.push({
          status: itemStatus,
          name: itemName,
          mesh: itemMesh,
        })
      }

      this.tableData.data = result
    },
  },
}
</script>
