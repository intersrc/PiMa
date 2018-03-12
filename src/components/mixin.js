import * as gTypes from 'pima-store/getterTypes'

export default {
  computed: {
    state () {
      return this.$store.state
    },
    current () {
      return this.state.current
    },
    tags () {
      return this.state.tags
    },
    tagList () {
      return this.$store.getters[gTypes.TAG_LIST]
    },
    pageLength () {
      return this.$store.getters[gTypes.PAGE_LENGTH]
    },
    isStatic () {
      return this.$store.getters[gTypes.IS_STATIC]
    },
    currentBase () {
      return this.$store.getters[gTypes.CURRENT_BASE]
    },
    currentPictures () {
      return this.$store.getters[gTypes.CURRENT_PICTURES]
    },
    currentPagedPictures () {
      return this.$store.getters[gTypes.CURRENT_PAGED_PICTURES]
    },
    currentPicture () {
      return this.$store.getters[gTypes.CURRENT_PICTURE]
    },
    currentPictureTagIds () {
      return this.$store.getters[gTypes.CURRENT_PICTURE_TAG_IDS]
    }
  },
  methods: {
    getSrc (picture) {
      let src
      if (picture) {
        const { basePath, path } = picture
        if (this.isStatic) {
          src = `./web/${path}`
        } else {
          // src = `file:///${this.currentBase.path}${path}`
          src = `file:///${basePath}${path}`
        }
      } else {
        src = ''
      }
      return src
    },
    getIsVideo (picture) {
      return /\.(mp4|webm)$/.test(picture.path)
    }
  }
}
