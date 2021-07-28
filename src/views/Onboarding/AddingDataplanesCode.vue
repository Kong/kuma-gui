<template>
  <div class="container mx-auto">
    <div class="min-h-96">
      <OnboardingHeading
        title="Adding new DPPs"
      />
      <div
        v-if="onboardingMode==='demo'"
        class="md:w-4/5 lg:w-3/5 mx-auto"
      >
        <p
          v-if="isMultiZone"
          class="text-xs tracking-wider px-4 py-2 text-red-500"
        >
          Remember to apply yamls into control plane with "mode=zone"
        </p>
        <CodeView
          title="Clone app and follow the steps"
          copy-button-text="Copy Command to Clipboard"
          lang="bash"
          :content="githubLink"
        />
      </div>
      <div
        v-else
        class="md:w-4/5 lg:w-3/5 mx-auto"
      >
        <CodeView
          title="Generate token"
          copy-button-text="Copy Command to Clipboard"
          lang="bash"
          :content="generateDpTokenCode"
        />
        <CodeView
          title="Start Dataplane Process"
          copy-button-text="Copy Command to Clipboard"
          lang="bash"
          :content="startDpCode"
        />
      </div>
    </div>

    <OnboardingNavigation
      next-step="onboarding-dataplanes-overview"
      previous-step="onboarding-adding-dpp"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { kumaDpServerUrl } from '@/configUrl'
import json2yaml from '@appscode/json2yaml'
import CodeView from '@/components/Skeletons/CodeView'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'

export default {
  name: 'AddingDataplanesCode',
  components: {
    CodeView,
    OnboardingNavigation,
    OnboardingHeading
  },
  data() {
    return {
      githubLink: 'https://github.com/kumahq/kuma-counter-demo/',
      generateDpTokenCode: 'kumactl generate dataplane-token --name=redis > kuma-token-redis',
      startDpCode: `kuma-dp run \\
      --cp-address=${kumaDpServerUrl()} \\
      --dataplane=${`"${json2yaml({
                  type: 'Dataplane',
                  mesh: 'default',
                  name: 'example',
                  networking: {
                    address: 'localhost',
                    inbound: [
                      {
                        port: 7777,
                        servicePort: 7777,
                        serviceAddress: '127.0.0.1',
                        tags: {
                          'kuma.io/service': 'example',
                          'kuma.io/protocol': 'tcp'
                        }
                      }
                    ]
                  }
                })}"`} \\
      --dataplane-token-file=kuma-token-example`
    }
  },
  computed: {
    ...mapGetters({
      isMultiZone: 'config/getMulticlusterStatus',
      env: 'config/getEnvironment',
      onboardingMode: 'onboarding/getMode',
    }),
  },

}
</script>
