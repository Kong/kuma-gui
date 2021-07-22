<template>
  <div>
    <KPop
      placement="bottom"
      trigger="hover"
    >
      <span>Standalone 1</span>
      <div slot="content">
        <p>Text of Standalone 1</p>
      </div>
    </KPop>

    <KPop
      placement="bottom"
      trigger="hover"
    >
      <span>Standalone 2</span>
      <div slot="content">
        <p>Text of Standalone 2</p>
      </div>
    </KPop>
  </div>
</template>

<script>
export default {
  name: 'StandaloneDeploymentGraph'
}
</script>

<style>

</style>
