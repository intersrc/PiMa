<template lang="pug">
  div(class="pima-explorer")
    pima-pagination(
      @pre="onPre",
      @next="onNext"
    )
    div(
      v-for="p in currentPagedPictures",
      class="pima-explorer__thumb"
      :style="{ backgroundImage: `url(${getSrc(p)})` }",
      @click="onPicClick"
    )
</template>

<style lang="stylus">
  @import '~pima-components/style.styl'
  .pima-explorer
    text-align center
  .pima-explorer__thumb
    display inline-block
    width $thumb-size
    height $thumb-size
    background-position center
    background-repeat no-repeat
    background-size contain
    border $thumb-border
    cursor pointer
    margin-top $thumb-margin
    margin-left ($thumb-margin / 2)
    margin-right ($thumb-margin / 2)
</style>

<script>
  import * as mTypes from 'pima-store/mutationTypes'

  export default {
    methods: {
      onPicClick () {

      },
      onPre () {
        this.$store.commit(mTypes.SET_PAGE, { delta: -1 })
      },
      onNext () {
        this.$store.commit(mTypes.SET_PAGE, { delta: 1 })
      }
    }
  }
</script>
