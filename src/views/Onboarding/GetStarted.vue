<template>
  <div class="welcome welcome__step-1">
    <p
      v-if="title"
      class="type-lg"
    >
      {{ title }} has been successfully installed but the cluster is currently empty.
      You are only a few steps away from deploying a modern distributed service mesh!
    </p>

    <div class="app-setup">
      <h3 class="type-xl">
        Let's set up your app
      </h3>

      <div class="app-source-check">
        <div
          v-if="appSource
            && appSource === 'universal'
            || appSource === 'kubernetes'
            || appSource === 'k8s'"
          class="app-source-check__inner flex items-center"
        >
          <div class="app-source-check__icon mr-4">
            <img
              v-if="appSource === 'universal'"
              src="@/assets/images/icon-universal-alt.png?external"
              alt="Universal Icon"
            >
            <img
              v-else-if="appSource === 'kubernetes' || appSource === 'k8s'"
              src="@/assets/images/icon-k8s.png?external"
              alt="Kubernetes Icon"
            >
          </div>
          <div class="app-source-check__content px-4">
            <p>{{ title }} is running on <span class="capitalize">{{ appSource }}</span></p>
          </div>
          <div class="px-4">
            <img
              src="@/assets/images/icon-checkmark.svg?external"
              alt="Checkmark Icon"
            >
          </div>
        </div>
        <div
          v-else
          class="app-source-check--error"
        >
          <p>The app was unable to determine {{ productName }}'s environment.</p>
        </div>
      </div>

      <div
        v-if="tableDataLoadAttempted === false"
        class="dataplane-loading-state flex -mx-2 mt-8"
      >
        <div class="px-2">
          <KIcon
            icon="spinner"
            size="36"
            color="black"
          />
        </div>
        <div class="px-2">
          <p>
            Waiting for data plane proxies to connect&hellip;
          </p>
        </div>
      </div>
      <div
        v-else-if="tableData && tableDataIsEmpty === false"
        class="mt-8"
      >
        <h2 class="type-xl mb-2 pb-2">
          <span v-if="dataplaneCountForTitle === 1">
            {{ dataplaneCountForTitle }} data plane proxy found:
          </span>
          <span v-else-if="dataplaneCountForTitle <= 10">
            {{ dataplaneCountForTitle }} data plane proxies found:
          </span>
          <span v-else>
            {{ dataplaneCountForTitle }} data plane proxies found, including:
          </span>
        </h2>
        <div class="data-table-wrapper">
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
        <div class="md:flex items-center mt-4">
          <div class="md:flex items-center md:mr-2 dataplane-global-status">
            <div>
              <KButton
                appearance="primary"
                class="mr-2"
                @click="reScanForDataplanes"
              >
                Refresh
              </KButton>
            </div>
            <KAlert
              v-if="overallDpStatus"
              class="dataplane-status-alert"
              appearance="danger"
              alert-message="Some data plane proxies appear to be offline."
            />
          </div>
          <div class="md:ml-auto">
            <KButton
              :to="{ name: 'setup-complete' }"
              appearance="primary"
            >
              Next Step
            </KButton>
          </div>
        </div>
        <div
          v-if="overallDpStatus"
          class="dataplane-global-status__helper-text mt-8"
        >
          <h3 class="type-xl mb-2 mt-4">
            Offline data plane proxies
          </h3>
          <p>
            This means your data plane proxy is not connected to the control plane
            at the moment. This might be due to a scheduled downtime or a
            network partitioning problem.
          </p>
        </div>
      </div>
      <div v-else>
        <div class="dataplane-fallback">
          <div class="dataplane-fallback__inner flex -mx-4">
            <div class="dataplane-fallback__icon px-4">
              <img
                src="@/assets/images/icon-dataplane.svg?external"
                alt="Dataplane Icon"
              >
            </div>
            <div class="dataplane-fallback__content px-4">
              <h3 class="type-lg dataplane-fallback__title mb-2 pb-2">
                No data plane proxies detected.
              </h3>
              <p class="mb-2">
                To bring your applications into {{ productName }} Service Mesh,
                you need to deploy data plane proxies (also known as sidecar proxies)
                next to them.
              </p>
            </div>
          </div>
        </div>
        <!-- .dataplane-fallback -->
        <div class="dataplane-walkthrough my-4">
          <!-- kubernetes instructions -->
          <div>
            <h3 class="type-xl mb-2">
              Next steps
            </h3>
            <p class="mb-2">
              The data plane proxy wizard will walk you through the creation of new
              sidecar proxies.
            </p>
            <div class="cols">
              <KButton
                :to="{ name: dataplaneWizardRoute}"
                appearance="primary"
              >
                Get started
              </KButton>
            </div>
          </div>

          <!-- <KButton
            appearance="primary"
            class="mt-4"
            @click="reScanForDataplanes()"
          >
            Re-scan for data plane proxies
          </KButton> -->
        </div>
      </div>
      <footer class="extra-controls">
        <KButton
          :to="{
            name: 'global-overview',
            params: {
              mesh: 'all',
              expandSidebar: true
            }
          }"
          appearance="secondary"
          size="small"
          @click.native="completeOnboarding()"
        >
          Skip to Dashboard
        </KButton>
      </footer>
    </div>
    <!-- .app-source-check -->

    <!-- <demo-app /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setItemToStorage } from '@/Cache'
import { PRODUCT_NAME } from '@/consts'

export default {
  name: 'OnboardingStep1',
  metaInfo() {
    return {
      title: `Welcome to ${this.productName}!`,
    }
  },
  data() {
    return {
      appSourceError: false,
      productName: PRODUCT_NAME,
      tableDataLoadDelay: 1500,
      tableDataIsEmpty: true,
      tableDataLoadAttempted: false,
      tableDataDataplaneCount: null,
      tableData: {
        headers: [
          { label: 'Status', key: 'status' },
          { label: 'Name', key: 'name' },
          { label: 'Mesh', key: 'mesh' },
        ],
        data: [],
      },
      pageSize: 10,
    }
  },
  computed: {
    ...mapGetters({
      title: 'config/getTagline',
      appSource: 'config/getEnvironment',
    }),
    dataplaneCountForTitle() {
      const count = this.tableDataDataplaneCount
      if (count && count > 10) {
        return '10+'
      } else {
        return count
      }
    },
    overallDpStatus() {
      return this.$store.getters.getAnyDpOffline
    },
    dataplaneWizardRoute() {
      return this.appSource === 'universal' ? 'universal-dataplane' : 'kubernetes-dataplane'
    },
  },
  beforeMount() {
    this.bootstrap()
  },
  methods: {
    bootstrap() {
      this.isLoading = true
      this.isEmpty = false

      this.getDataplaneTableData()
      this.completeOnboarding()
    },

    reScanForDataplanes() {
      this.tableDataIsEmpty = false
      this.tableDataLoadAttempted = false

      this.getDataplaneTableData()
    },

    getDataplaneTableData() {
      const params = {
        size: this.pageSize,
      }

      this.$store.dispatch('getAllDataplanes', params).then(() => {
        const dataplanes = Object.values(this.$store.getters.getDataplanesList)

        if (dataplanes && dataplanes.length > 0) {
          this.tableDataDataplaneCount = dataplanes.length
          this.tableData.data = dataplanes
          this.tableDataLoadAttempted = false
          this.tableDataIsEmpty = false

          setTimeout(() => {
            this.tableDataLoadAttempted = true
          }, this.tableDataLoadDelay)
        } else {
          this.tableDataLoadAttempted = true
          this.tableDataIsEmpty = true
        }
      })
    },

    completeOnboarding() {
      this.$store.dispatch('updateOnboardingStatus', true)
      setItemToStorage('kumaOnboardingComplete', true)
    },
  },
}
</script>

<style lang="scss">
@mixin styledPanel {
  background-color: #f2f5f7;
  padding: var(--spacing-lg);
  border-radius: 4px;
  margin-top: var(--spacing-md);
}

@mixin styledPanelSmall {
  padding: var(--spacing-sm) var(--spacing-lg);
  margin-top: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  border-radius: 4px;
}

.app-setup {
  padding: var(--spacing-md) 0;
  margin: var(--spacing-md) 0;
  border-top: 1px solid var(--grey-200);
}

.app-source-check--error {
  @include styledPanelSmall;

  background-color: var(--red-200);
  color: var(--red-600);
}

.app-source-check__inner {
  @include styledPanelSmall;

  background-color: var(--blue-200);

  > *:first-child {
    flex: 0 0 12%;
  }

  > *:last-child {
    margin-left: auto;
  }
}

.dataplane-fallback {
  @include styledPanel;
}

.dataplane-fallback__icon {
  flex: 0 0 12%;

  img {
    width: 100%;
    height: auto;
  }
}

.dataplane-fallback__title {
  border-bottom: 1px solid var(--grey-200);
}

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

.dataplane-walkthrough {
  p:not(:last-of-type) {
    margin-bottom: 16px;
  }

  pre {
    white-space: pre-wrap;
  }

  code {
    @include styledPanel;

    word-break: break-word !important;

    display: block;
    font-family: var(--font-family-mono);
  }
}

.dataplane-global-status__helper-text {
  border-top: 1px solid var(--grey-200);
}

.cols {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px -8px;

  > * {
    margin: 0 8px;
  }
}

.extra-controls {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--grey-200);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-sm);
}

.dataplane-status-alert {
  padding: var(--spacing-xs) !important;
}

@media (max-width: 767px) {
  .dataplane-global-status {
    display: block;
    margin-bottom: var(--spacing-sm);
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--grey-200);

    > * {
      margin-bottom: var(--spacing-sm);
    }
  }
}
</style>
