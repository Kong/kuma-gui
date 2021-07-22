<template>
  <div>
    <h1 class="text-center text-4xl mb-6">
      {{ title }}
    </h1>
    <p class="text-center">
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
      required: true
    }
  }
}
</script>
