<template lang="pug">
  div
    router-view
    template(v-if="isStatic")
      pre {{ JSON.stringify(currentPictureTagIds, null, 2) }}
      pre {{ JSON.stringify($store.state, null, 2) }}
</template>

<style lang="stylus">
  @import '~pima-components/style.styl'
  body, select
    background-color black
    color white
    font-size: 14px
    line-height: 21px
  select
    border-color: $border-color
</style>

<script>
  import mixin from 'pima-components/mixin'
  import * as aTypes from 'pima-store/actionTypes'

  export default {
    components: {},
    mixins: [mixin],
    mounted () {
      this.$store.dispatch(aTypes.READ_DATA)
    }
  }
</script>
