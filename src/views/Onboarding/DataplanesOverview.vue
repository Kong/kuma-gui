<template>
  <div class="container mx-auto">
    <div>
      <div class="h-40">
        <h1>Welcome to {{ title }}</h1>
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
    <div class="mt-4 flex justify-center">
      <KButton
        class="mr-4"
        appearance="primary"
        :to="{
          name: 'global-overview',
        }"
      >
        Get Started
      </KButton>
      <KButton
        appearance="secondary"
        :to="{
          name: 'global-overview'
        }"
      >
        or Skip
      </KButton>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DataplanesOverview',
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

<style scoped></style>
