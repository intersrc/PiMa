import * as gTypes from 'pima-store/getterTypes'

export default {
  computed: {
    current () {
      return this.$store.state.current
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
    }
  },
  methods: {
    getSrc (picture) {
      if (picture) {
        const { path } = picture
        if (this.isStatic) {
          return `./web/${path}`
        } else {
          return `file:///${this.currentBase.path}${path}`
        }
      } else {
        return ''
      }
    }
  }
}
