<template>
  <div>
    <GlobalHeader />
    <div class="overview">
      <KEmptyState>
        <template v-slot:title>
          <KIcon
            class="kong-icon--centered"
            color="var(--yellow-200)"
            icon="warning"
            secondary-color="var(--black-75)"
            size="64"
          />
          Page Not Found
        </template>
        <template v-slot:message>
          The page or entity you were looking for does not exist.
        </template>
        <template v-slot:cta>
          <KButton
            appearance="primary"
            :to="{
              name: 'global-overview',
              params: {
                mesh: currentMesh
              }
            }"
          >
            Go Home
          </KButton>
        </template>
      </KEmptyState>
    </div>
  </div>
</template>

<script>
import GlobalHeader from '@/components/Global/Header'
export default {
  name: 'NotFound',
  components: { GlobalHeader },
  metaInfo: {
    title: 'Item Not Found',
  },
  computed: {
    currentMesh() {
      const meshFromLS = localStorage.getItem('selectedMesh')
      const meshFromState = this.$store.getters.getSelectedMesh

      if (meshFromLS && meshFromLS.length > 0) {
        return meshFromLS
      } else {
        return meshFromState
      }
    },
  },
}
</script>
