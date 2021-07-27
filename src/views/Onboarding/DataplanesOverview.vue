<template>
  <div class="container mx-auto">
    <div>
      <OnboardingHeading
        title="Waiting for DPPs"
        description="Now that we have deployed our first DPPs (data plane proxies), we need to wait for them to come online:"
      />
      <div class="md:w-4/5 lg:w-3/5 mx-auto">
        <div class="justify-center flex my-4">
          <KIcon
            v-if="!getDataplanesList.length"
            data-testid="loading"
            icon="spinner"
            color="rgba(0, 0, 0, 0.2)"
            size="42"
          />

          <div
            v-else
            class="data-table-wrapper"
          >
            <KTable :options="tableData">
              <template
                v-slot:status="{ rowValue }"
              >
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
    </div>
    <OnboardingNavigation
      next-step="onboarding-adding-dpp-code"
      previous-step="onboarding-adding-dpp-code"
      :should-display-next="getDataplanesList.length > 0"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'

export default {
  name: 'DataplanesOverview',
  components: {
    OnboardingNavigation,
    OnboardingHeading
  },
  computed: {
    ...mapGetters(['getDataplanesList']),
    tableData() {
      return {
        headers: [
          { label: 'Status', key: 'status' },
          { label: 'Name', key: 'name' },
          { label: 'Mesh', key: 'mesh' }
        ],
        data: this.getDataplanesList
      }
    }
  },
  watch: {
    getDataplanesList: debounce(function(val) {
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
  }
}
</script>

<style lang="scss" scoped>

.data-table-wrapper {
  overflow: hidden;
  border: 1px solid var(--gray-4);
  background: none;
  border-radius: 4px;

  .k-table thead {
    background-color: var(--gray-5);
    border-top: 0;
  }

}

</style>
