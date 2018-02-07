<template lang="pug">
  div
    router-view
    pre(v-if="isStatic") {{ JSON.stringify($store.state, null, 2) }}
</template>

<style lang="stylus">
  *
    background-color black
    color white
</style>

<script>
  export default {}
</script>
