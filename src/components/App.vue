<template lang="pug">
  div
    app-nav
    router-view
    pre(v-if="isStatic") {{ JSON.stringify($store.state, null, 2) }}
</template>

<style lang="stylus">
  @import '~pima-components/style.styl'
  body, select
    background-color black
    color white
    font-size: 14px
    line-height: 21px
  select
    border-color: $thumb-border-color
</style>

<script>
  import mixin from 'pima-components/mixin'
  import AppNav from './AppNav'

  export default {
    mixins: [mixin],
    components: {
      AppNav
    }
  }
</script>
