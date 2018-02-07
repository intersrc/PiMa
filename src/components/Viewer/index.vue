<template lang="pug">
  div(class="pima-viewer")
    pima-pagination(
      :page="page",
      :page-length="pageLength",
      @page="onPage",
      @pre="onPre",
      @next="onNext"
    )
    img(
      class="pima-viewer__img",
      :src="getSrc(currentPicture)"
    )
</template>

<style lang="stylus">
  @import '~pima-components/style.styl'
  .pima-viewer
    text-align: center
  .pima-viewer__img
    border: $border
</style>

<script>
  import mixin from 'pima-components/mixin'
  import * as gTypes from 'pima-store/getterTypes'
  import * as mTypes from 'pima-store/mutationTypes'

  export default {
    mixins: [mixin],
    computed: {
      page () {
        return this.$store.getters[gTypes.CURRENT_PICTURE_PAGE]
      },
      pageLength () {
        return this.currentPictures.length
      }
    },
    methods: {
      onPage ({ page }) {
        this.$store.commit(mTypes.SET_PICTURE_BY_PAGE, { page })
      },
      onPre () {
        this.$store.commit(mTypes.SET_PICTURE_BY_PAGE, { delta: -1 })
      },
      onNext () {
        this.$store.commit(mTypes.SET_PICTURE_BY_PAGE, { delta: 1 })
      }
    }
  }
</script>
