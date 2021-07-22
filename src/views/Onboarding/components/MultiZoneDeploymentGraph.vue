<template>
  <div>
    <KPop
      placement="bottom"
      trigger="hover"
    >
      <span>Multizone 1</span>
      <div slot="content">
        <p>Text of Multizone 1</p>
      </div>
    </KPop>

    <KPop
      placement="bottom"
      trigger="hover"
    >
      <span>Multizone 2</span>
      <div slot="content">
        <p>Text of Multizone 2</p>
      </div>
    </KPop>
  </div>
</template>

<script>
export default {
  name: 'MultiZoneDeploymentGraph'
}
</script>
