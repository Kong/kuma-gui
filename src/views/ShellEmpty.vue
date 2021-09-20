<template>
  <transition
    mode="out-in"
    name="fade"
  >
    <router-view />
  </transition>
</template>

<script>
export default {
  name: 'ShellEmpty',
}
</script>
