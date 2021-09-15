<template>
  <div class="local-cps">
    <FrameSkeleton class="py-2 px-4">
      <KCard
        v-if="config"
        border-variant="noBorder"
      >
        <template v-slot:body>
          <prism
            class="code-block"
            language="json"
            :code="codeOutput"
          />
        </template>
        <template v-slot:actions>
          <KClipboardProvider
            v-if="codeOutput"
            v-slot="{ copyToClipboard }"
          >
            <KPop placement="bottom">
              <KButton
                appearance="primary"
                @click="() => { copyToClipboard(codeOutput) }"
              >
                Copy config to clipboard
              </KButton>
              <template v-slot:content>
                <div>
                  <p>Config copied to clipboard!</p>
                </div>
              </template>
            </KPop>
          </KClipboardProvider>
        </template>
      </KCard>

      <!-- loading / error handling -->
      <KEmptyState
        v-if="!config"
        cta-is-hidden
      >
        <template v-slot:title>
          <div class="card-icon mb-3">
            <KIcon
              v-if="icon"
              class="kong-icon--centered"
              :color="iconColor"
              :icon="icon"
              size="42"
            />
          </div>
          <span v-if="isLoading">
            Data Loading...
          </span>
          <span v-else-if="hasError">
            An error has occurred while trying to load this data.
          </span>
        </template>
      </KEmptyState>
    </FrameSkeleton>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Prism from 'vue-prismjs'

import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'

export default {
  name: 'Diagnostics',
  metaInfo: {
    title: 'Diagnostics',
  },
  components: {
    FrameSkeleton,
    Prism,
  },
  data() {
    return {
      isLoading: true,
      hasError: false,
    }
  },
  computed: {
    ...mapGetters({
      config: 'config/getConfig',
    }),
    icon() {
      if (this.isLoading) {
        return 'spinner'
      } else if (this.hasError) {
        return 'warning'
      }

      return false
    },
    iconColor() {
      if (this.hasError) {
        return 'var(--yellow-200)'
      }

      return '#ccc'
    },
    codeOutput() {
      const code = this.config

      return JSON.stringify(code, null, 2)
    },
  },
}
</script>

<style lang="scss" scoped>
.card-icon {
  text-align: center;

  img,
  svg {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
