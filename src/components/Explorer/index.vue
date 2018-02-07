<template lang="pug">
  div(class="pima-explorer")
    pima-nav(
      :p-page="current.page",
      :p-page-length="pageLength",
      @page="onPage",
      @pre="onPre",
      @next="onNext"
    )
    div(
      v-for="p in currentPagedPictures",
      class="pima-explorer__thumb"
      :style="{ backgroundImage: `url(${getSrc(p)})` }",
      @click="onPicClick(p)"
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
  import mixin from 'pima-components/mixin'
  import * as mTypes from 'pima-store/mutationTypes'

  export default {
    mixins: [mixin],
    methods: {
      onPicClick (picture) {
        this.$store.commit(mTypes.SET_PICTURE, { pictureId: picture.id })
        this.$router.push('viewer')
      },
      onPage ({ page }) {
        this.$store.commit(mTypes.SET_PAGE, { page })
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
