<template lang="pug">
  div(class="pima-viewer")
    pima-nav(
      :p-page="page",
      :p-page-length="pageLength",
      @page="onPage",
      @pre="onPre",
      @next="onNext",
      @scale="onScale",
      @scale-plus="onScalePlus",
      @scale-minus="onScaleMinus",
    )
    img(
      ref="img",
      class="pima-viewer__img",
      :style="imgStyle",
      :src="getSrc(currentPicture)"
    )
</template>

<style lang="stylus">
  @import '~pima-components/style.styl'
  .pima-viewer
    text-align center
  .pima-viewer__img
    border $border
    user-select none
</style>

<script>
  import mixin from 'pima-components/mixin'
  import * as gTypes from 'pima-store/getterTypes'
  import * as mTypes from 'pima-store/mutationTypes'

  export default {
    mixins: [mixin],
    data () {
      return {
        imgStyleMargin: 16,
        imgStyleHeight: 'auto'
      }
    },
    computed: {
      page () {
        return this.$store.getters[gTypes.CURRENT_PICTURE_PAGE]
      },
      pageLength () {
        return this.currentPictures.length
      },
      imgStyle () {
        return {
          margin: `${this.imgStyleMargin}px 0`,
          height: this.imgStyleHeight
        }
      }
    },
    methods: {
      updateImgStyleHeight () {
        if (this.$refs.img) {
          const scale = this.current.scale
          const naturalHeight = this.$refs.img.naturalHeight
          this.imgStyleHeight = scale === 1 ? 'auto' : `${naturalHeight * scale}px`
        } else {
          this.imgStyleHeight = 'auto'
        }
      },
      onPage ({ page }) {
        this.$store.commit(mTypes.SET_PICTURE_BY_PAGE, { page })
      },
      onPre () {
        this.$store.commit(mTypes.SET_PICTURE_BY_PAGE, { delta: -1 })
      },
      onNext () {
        this.$store.commit(mTypes.SET_PICTURE_BY_PAGE, { delta: 1 })
      },
      onScale ({ navHeight }) {
        const naturalHeight = this.$refs.img.naturalHeight
        const viewerHeight = window.innerHeight - navHeight - this.imgStyleMargin * 2
        this.$store.commit(mTypes.SET_SCALE, { scale: this.current.scale === 1 ? viewerHeight / naturalHeight : 1 })
        this.updateImgStyleHeight()
      },
      onScalePlus () {
        this.$store.commit(mTypes.SET_SCALE, { scale: this.current.scale * 2 })
        this.updateImgStyleHeight()
      },
      onScaleMinus () {
        this.$store.commit(mTypes.SET_SCALE, { scale: this.current.scale / 2 })
        this.updateImgStyleHeight()
      }
    }
  }
</script>
