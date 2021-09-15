<template>
  <div>
    <GlobalHeader />
    <div class="main-content-container">
      <div class="main-content">
        <transition
          mode="out-in"
          name="fade"
        >
          <router-view />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import GlobalHeader from '@/components/Global/Header'
export default {
  name: 'ShellWithHeader',
  components: {
    GlobalHeader,
  },
}
</script>
