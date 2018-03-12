<template lang="pug">
  div(class="pima-viewer")
    pima-nav(
      ref="nav",
      :p-page="page",
      :p-page-length="pageLength",
      :checked-map="checkedMap",
      @page="onPage",
      @pre="onPre",
      @next="onNext",
      @random="onRandom",
      @scale="onScale",
      @scale-plus="onScalePlus",
      @scale-minus="onScaleMinus",
      @tag-click="onTagClick"
    )
      div {{ viewTimeString }}

    div(style="padding-left: 150px;")
      //- pre {{ JSON.stringify(current, null, 2) }}
      //- pre {{ JSON.stringify(currentPicture, null, 2) }}
      template(v-if="getIsVideo(currentPicture)")
        video(
          ref="img",
          class="pima-viewer__img",
          :style="imgStyle",
          :src="getSrc(currentPicture)",
          autoplay,
          controls,
          @click="onClickImg"
        )
      template(v-else)
        img(
          ref="img",
          class="pima-viewer__img",
          :style="imgStyle",
          :src="getSrc(currentPicture)",
          @click="onClickImg"
        )
      div {{ getSrc(currentPicture) }}
        button(
          style="margin-left: 8px;",
          @click="onCopySrc"
        ) Copy Src
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
  import copy from 'copy-to-clipboard'
  import mixin from 'pima-components/mixin'
  // import * as aTypes from 'pima-store/actionTypes'
  import * as gTypes from 'pima-store/getterTypes'
  import * as mTypes from 'pima-store/mutationTypes'

  const SCALE = 1.125

  export default {
    mixins: [mixin],
    data () {
      return {
        currentTime: 0,
        viewTime: 0,
        viewTimer: null,
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
          height: this.imgStyleHeight,
          transform: this.current.isHorizontalFlipped ? 'scaleX(-1)' : ''
        }
      },
      checkedMap () {
        const map = {}
        this.currentPicture.tags.forEach(tag => { map[tag.id] = true })
        return map
      },
      viewTimeString () {
        const allSeconds = Math.floor((this.currentTime - this.viewTime) / 1000)
        const minutes = Math.floor(allSeconds / 60)
        const seconds = allSeconds - minutes * 60
        const secondsString = seconds < 10 ? `0${seconds}` : seconds
        return `${minutes}:${secondsString}`
      }
    },
    watch: {
      currentPicture () {
        this.resetTimer()
      }
    },
    mounted () {
      const navHeight = this.$refs.nav.$el.clientHeight
      const viewerHeight = window.innerHeight - navHeight - this.imgStyleMargin * 2
      this.imgStyleHeight =  `${viewerHeight}px`

      this.resetTimer()
      this.viewTimer = window.setInterval(() => {
        this.currentTime = (new Date).getTime()
      }, 1000)
    },
    beforeDestroy () {
      if (this.viewTimer) {
        window.clearInterval(this.viewTimer)
      }
    },
    methods: {
      resetTimer () {
        this.viewTime = (new Date).getTime()
        this.currentTime = (new Date).getTime()
      },
      onCopySrc () {
        copy(this.getSrc(this.currentPicture))
      },
      onTagClick ({ tag }) {
        this.$store.commit(mTypes.VIEWER_TOGGLE_TAG, {
          tagId: tag.id
        })
      },

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
      onRandom () {
        let page
        do {
          page = Math.floor(Math.random() * this.pageLength)
        } while (this.page === page)
        this.$store.commit(mTypes.SET_PICTURE_BY_PAGE, { page })
      },
      onScale () {
        const navHeight = this.$refs.nav.$el.clientHeight
        const naturalHeight = this.$refs.img.naturalHeight
        const viewerHeight = window.innerHeight - navHeight - this.imgStyleMargin * 2
        this.$store.commit(mTypes.SET_SCALE, { scale: this.current.scale === 1 ? viewerHeight / naturalHeight : 1 })
        this.updateImgStyleHeight()
      },
      onScalePlus () {
        this.$store.commit(mTypes.SET_SCALE, { scale: this.current.scale * SCALE })
        this.updateImgStyleHeight()
      },
      onScaleMinus () {
        this.$store.commit(mTypes.SET_SCALE, { scale: this.current.scale / SCALE })
        this.updateImgStyleHeight()
      },
      onClickImg () {
        this.onScale()
      }
    }
  }
</script>
