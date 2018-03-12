<template lang="pug">
  div(class="pima-explorer")
    pima-nav(
      :p-page="current.page",
      :p-page-length="pageLength",
      :checked-map="checkedMap",
      @page="onPage",
      @pre="onPre",
      @random="onRandom",
      @next="onNext",
      @tag-click="onTagClick"
    )
    div(class="pima-explorer__thumb-container")
      div(
        v-for="p in currentPagedPictures",
        :key="p.id",
        class="pima-explorer__thumb",
        :class="{ 'pima-explorer__thumb--selected': currentPicture && p.id === currentPicture.id }"
        :style="{ backgroundImage: `url(\"${getSrc(p)}\")` }",
        @click="onPicClick(p)"
      )
        video(
          v-if="getIsVideo(p)",
          class="pima-explorer__thumb-video",
          autoplay,
          loop,
          muted,
          :src="getSrc(p)"
        )
        span(class="pima-explorer__blank") &nbsp;
        i(
          v-if="p.isBookmarked",
          class="pima-explorer__bookmark fas fa-bookmark"
        )
        template(v-if="p.poseNumber")
          i(
            v-for="n in p.poseNumber",
            class="pima-explorer__pose fas fa-female"
          )
        template(v-if="p.sketchNumber")
          i(
            v-for="n in p.sketchNumber",
            class="pima-explorer__sketch fas fa-paint-brush"
          )
        template(v-if="p.starNumber")
          i(
            v-for="n in p.starNumber",
            class="pima-explorer__star fas fa-star"
          )
</template>

<style lang="stylus">
  @import '~pima-components/style.styl'
  .pima-explorer
    text-align center
  .pima-explorer__thumb-container
    text-align right
  .pima-explorer__thumb
    display inline-block
    position relative
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
    box-shadow 0 0 0 1px $border-color
    &:hover
      box-shadow 0 0 0 1px lightgrey
  .pima-explorer__thumb--selected
    border $thumb-border--selected
  .pima-explorer__thumb-video
    max-width 100%
    max-height 100%
    position absolute
    top 0
    left 0
    z-index -1
  .pima-explorer__star
    color gold
  .pima-explorer__bookmark
    color orangered
  .pima-explorer__pose
    color deepskyblue
  .pima-explorer__star, .pima-explorer__bookmark, .pima-explorer__sketch, .pima-explorer__pose
    margin-left 2px
    background black
</style>

<script>
  import mixin from 'pima-components/mixin'
  import * as mTypes from 'pima-store/mutationTypes'

  export default {
    mixins: [mixin],
    computed: {
      checkedMap () {
        return {
          [this.current.tagId]: true
        }
      }
    },
    methods: {
      onTagClick ({ tag }) {
        this.$store.commit(mTypes.EXPLORER_TOGGLE_TAG, { tagId: tag.id })
        /*
        if (this.current.tagId) {
          this.$store.commit(mTypes.SET_BASE, { baseIndex: -1 })
        }
        */
      },
      onPicClick (picture) {
        this.$store.commit(mTypes.SET_PICTURE, { pictureId: picture.id, basePath: picture.basePath })
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
      },
      onRandom () {
        let page
        do {
          page = Math.floor(Math.random() * this.pageLength)
        } while (this.current.page === page)
        this.$store.commit(mTypes.SET_PAGE, { page })
      }
    }
  }
</script>
