<template>
  <div>
    <GlobalHeader />
    <div class="main-content-container">
      <Sidebar />

      <main class="main-content">
        <OnboardingCheck v-if="showOnboarding" />
        <Breadcrumbs />
        <transition
          mode="out-in"
          name="fade"
        >
          <router-view />
        </transition>
      </main>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GlobalHeader from '@/components/Global/Header'
import Sidebar from '@/components/Sidebar/Sidebar'
import OnboardingCheck from '@/components/Utils/OnboardingCheck'
import Breadcrumbs from '@/components/Breadcrumbs.vue'

export default {
  name: 'Shell',
  components: {
    Breadcrumbs,
    Sidebar,
    OnboardingCheck,
    GlobalHeader,
  },
  computed: {
    ...mapGetters({
      showOnboarding: 'showOnboarding',
    }),
  },
}
</script>
