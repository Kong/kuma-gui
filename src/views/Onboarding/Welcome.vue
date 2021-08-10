<template>
  <OnboardingPage>
    <template #content>
      <OnboardingHeading
        :title="`   Welcome to ${title}`"
        :description="`Congratulations for downloading ${title}! In just few steps your
        service mesh will be fully online`"
      />

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
    </template>

    <template #navigation>
      <OnboardingNavigation
        simple-view
        next-step="onboarding-deployment-types"
      />
    </template>
  </OnboardingPage>
</template>

<script>
import { mapGetters } from 'vuex'
import OnboardingNavigation from '@/views/Onboarding/components/OnboardingNavigation'
import OnboardingPage from '@/views/Onboarding/components/OnboardingPage'
import OnboardingHeading from '@/views/Onboarding/components/OnboardingHeading'

export default {
  name: 'Welcome',
  components: {
    OnboardingNavigation,
    OnboardingPage,
    OnboardingHeading,
  },
  metaInfo() {
    return {
      title: `Welcome to ${this.$productName}!`,
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
    },
  },
}
</script>
