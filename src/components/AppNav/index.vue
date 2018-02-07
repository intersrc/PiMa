<template lang="pug">
  div(class="pima-app-nav")
    div(class="pima-app-nav__position-container")
      div(
        class="pima-app-nav__explorer",
        @click="onExplorerClick"
      )
        i(class="fas fa-th fa-3x")
</template>

<style lang="stylus">
  .pima-app-nav
    height 48px
  .pima-app-nav__position-container
    position absolute
    z-index 1
    top 0
    left 0
    display inline-block
    line-height: 48px
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
