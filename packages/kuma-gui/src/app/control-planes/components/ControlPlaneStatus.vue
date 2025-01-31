<template>
  <XCard class="health-card">
    <div class="card-header">
      <div class="card-title">
        <h2>{{ t('main-overview.detail.health.title') }}</h2>
      </div>
    </div>

    <XLayout
      type="columns"
      class="columns-with-borders"
    >
      <ResourceStatus
        v-if="props.canUseZones"
        :total="props.globalInsight.zones.controlPlanes.total"
        data-testid="zone-control-planes-status"
      >
        <template #icon>
          <img
            class="icon"
            src="@/assets/images/navigation/icon-zones.svg?url"
            alt="Zones Icon"
          >
        </template>
      
        <template #title>
          {{ t('main-overview.detail.health.zone_control_planes') }}
        </template>
      </ResourceStatus>

      <ResourceStatus
        :total="props.globalInsight.meshes.total"
        data-testid="meshes-status"
      >
        <template #icon>
          <img
            class="icon"
            src="@/assets/images/navigation/icon-meshes.svg?url"
            alt="Meshes Icon"
          >
        </template>

        <template #title>
          {{ t('main-overview.detail.health.meshes') }}
        </template>
      </ResourceStatus>

      <ResourceStatus
        :total="props.globalInsight.services.internal.total"
        data-testid="services-status"
      >
        <template #icon>
          <img
            class="icon"
            src="@/assets/images/icon-wifi-tethering.svg?url"
            alt="Services Icon"
          >
        </template>

        <template #title>
          {{ t('main-overview.detail.health.services') }}
        </template>
      </ResourceStatus>

      <ResourceStatus
        :total="props.globalInsight.dataplanes.standard.total"
        data-testid="data-plane-proxies-status"
      >
        <template #icon>
          <img
            class="icon"
            src="@/assets/images/icon-wifi-tethering.svg?url"
            alt="Data Plane Proxies Icon"
          >
        </template>

        <template #title>
          {{ t('main-overview.detail.health.data_plane_proxies') }}
        </template>
      </ResourceStatus>

      <ResourceStatus
        :total="props.globalInsight.policies.total"
        data-testid="policies-status"
      >
        <template #icon>
          <XIcon name="service-document" />
        </template>

        <template #title>
          {{ t('main-overview.detail.health.policies') }}
        </template>
      </ResourceStatus>
    </XLayout>
  </XCard>
</template>

<script lang="ts" setup>
import { useI18n } from '@/app/application'
import ResourceStatus from '@/app/common/ResourceStatus.vue'
import type { GlobalInsight } from '@/app/control-planes/data'

const { t } = useI18n()

const props = defineProps<{
  globalInsight: GlobalInsight
  canUseZones: boolean
}>()
</script>

<style lang="scss" scoped>
.health-card {
  container-type: inline-size;
  container-name: health-card;
}

.card-header {
  margin-bottom: $kui-space-50;
  min-height: 42px;
}

.icon {
  height: $kui-icon-size-30;
  width: $kui-icon-size-30;
}

@container health-card (max-width: 39.938rem) {
  .columns-with-borders > * {
    border-right: unset;
  }
}
</style>
