<template>
  <div class="w-full relative ">
    <transition
      leave-active-class="transition-opacity duration-300"
      leave-to-class="opacity-0"
    >
      <div
        v-if="overlay"
        data-testid="hoverable-overlay"
        class="absolute bg-black bg-opacity-75 w-full h-full"
        @mouseover="hideOverlay"
      >
        <span class="absolute right-0 text-white mr-4 mt-4">
          Mouse over the boxes
        </span>
      </div>
    </transition>

    <slot />
  </div>
</template>

<script>
export default {
  name: 'HoverableSvgWrapper',
  data() {
    return {
      overlay: true,
    }
  },
  methods: {
    hideOverlay() {
      this.overlay = false
    },
  },
}
</script>
