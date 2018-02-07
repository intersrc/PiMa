<template lang="pug">
  div
    div(
      class="pima-app-nav__explorer",
      @click="onExplorerClick"
    )
      i(class="fas fa-th fa-3x")
</template>

<style lang="stylus">
  .pima-app-nav__explorer
    display inline-block
    cursor pointer
</style>

<script>
  import mixin from 'pima-components/mixin'
  export default {
    mixins: [mixin],
    methods: {
      onExplorerClick () {
        this.$router.push('explorer')
      }
    }
  }
</script>
