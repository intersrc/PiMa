<template lang="pug">
  div(class="pima-loading")
    i(class="fas fa-spinner fa-5x fa-spin")
</template>

<style lang="stylus">
  @import '~pima-components/style.styl'
  .pima-loading
    background rgba(255,255,255,0.3)
    position fixed
    width 100%
    height 100%
    top 0
    left 0
    z-index 1
    color black
    display flex
    justify-content center
    align-items center
</style>

<script>
  export default {
  }
</script>
