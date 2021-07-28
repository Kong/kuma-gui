<template>
  <div class="mb-6">
    <h1 class="text-center text-4xl mb-4 min-h-8">
      {{ title }}
    </h1>
    <p
      v-if="description"
      class="text-center"
    >
      {{ description }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'OnboardingHeading',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    }
  }
}
</script>
