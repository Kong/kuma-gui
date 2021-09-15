<template>
  <div>
    <KPop
      placement="bottom"
      trigger="hover"
    >
      <span>Multizone 1</span>
      <template #content>
        <p>Text of Multizone 1</p>
      </template>
    </KPop>

    <KPop
      placement="bottom"
      trigger="hover"
    >
      <span>Multizone 2</span>
      <template #content>
        <p>Text of Multizone 2</p>
      </template>
    </KPop>
  </div>
</template>

<script>
export default {
  name: 'MultiZoneDeploymentGraph',
}
</script>
