import * as gTypes from 'pima-store/getterTypes'

export default {
  computed: {
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
    }
  },
  methods: {
    getSrc (picture) {
      const { path } = picture
      if (this.isStatic) {
        return `./web/${path}`
      } else {
        return `file:///${this.currentBase.path}${path}`
      }
    }
  }
}
