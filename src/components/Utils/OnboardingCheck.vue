<template>
  <div
    v-if="alertClosed === false"
    class="onboarding-check"
  >
    <KAlert
      appearance="info"
      class="dismissible"
      is-dismissible
      @closed="closeAlert"
    >
      <template v-slot:alertMessage>
        <div class="alert-content">
          <div>
            <strong>Welcome to {{ productName }}!</strong> We've detected that you don't have
            any data plane proxies running yet. We've created an onboarding process to
            help you!
          </div>
          <div>
            <KButton
              appearance="primary"
              size="small"
              class="action-button"
              :to="{ name: 'onboarding-welcome' }"
            >
              Get Started
            </KButton>
          </div>
        </div>
      </template>
    </KAlert>
  </div>
</template>

<script>
import { PRODUCT_NAME } from '@/consts'

export default {
  name: 'OnboardingCheck',
  data() {
    return {
      alertClosed: false,
      productName: PRODUCT_NAME,
    }
  },
  methods: {
    closeAlert() {
      this.alertClosed = true
    },
  },
}
</script>

<style lang="scss" scoped>
.onboarding-check {
  margin: 0 0 var(--spacing-xl) 0;
}

.alert-content {
  @media screen and (min-width: 700px) {
    display: flex;
    align-items: center;

    > *:first-of-type {
      margin-right: var(--spacing-md);
    }

    > *:last-of-type {
      min-width: 150px;
    }
  }

  @media screen and (max-width: 699px) {
    > *:last-of-type {
      margin-top: 10px;
    }
  }
}

.action-button.action-button {
  text-decoration: none;
}
</style>
