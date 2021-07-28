<template>
  <div class="container mx-auto">
    <div class="min-h-96">
      <div class="h-40">
        <h1 class="text-center text-4xl">
          Welcome to {{ title }}
        </h1>
      </div>
      <div class="md:w-4/5 lg:w-3/5 mx-auto">
        <p class="my-4">
          Congratulations for downloading {{ title }}! In just few steps your
          service mesh will be fully online
        </p>

        <div class="md:w-2/3 mx-auto">
          <p class="flex items-center mb-2">
            <KIcon
              class="mr-2"
              icon="check"
              color="var(--logo-green)"
            />
            <span>
              Automatically detected running in {{ mode }} deployment
            </span>
          </p>

          <p class="flex items-center mb-2">
            <KIcon
              class="mr-2"
              icon="check"
              color="var(--logo-green)"
            />
            <span>
              Automatically detected running in <span class="capitalize">{{ appSource }}</span>
            </span>
          </p>
        </div>
      </div>
    </div>
    <OnboardingNavigation
      simple-view
      next-step="onboarding-introduction"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'

export default {
  name: 'Welcome',
  components: {
    OnboardingNavigation
  },
  metaInfo () {
    return {
      title: `Welcome to ${this.$productName}!`
    }
  },
  computed: {
    ...mapGetters({
      getMulticlusterStatus: 'config/getMulticlusterStatus',
      title: 'config/getTagline',
      appSource: 'config/getEnvironment',
    }),
    mode() {
      return this.getMulticlusterStatus ? ' Multi-Zone ' : ' Standalone '
    }

  },
}
</script>
