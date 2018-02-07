<template lang="pug">
  div(class="pima-explorer")
    div(
      v-for="p in currentPictures",
      class="pima-explorer__thumb"
      :style="{ backgroundImage: `url(${getSrc(p)})` }",
      @click="onPicClick"
    )
</template>

<style lang="stylus">
  @import '~pima-components/style.styl'
  .pima-explorer
    text-align center
    position relative
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
  export default {
    methods: {
      onPicClick () {

      }
    }
  }
</script>
