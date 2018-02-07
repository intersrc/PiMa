export default {
  computed: {
    isStatic () {
      return process.env.NODE_ENV === 'static'
    },
    currentBaseIndex () {
      return this.$store.state.currentBaseIndex
    },
    currentBase () {
      return this.$store.state.bases[this.currentBaseIndex]
    },
    basePath () {
      return this.currentBase.path
    },
    all () {
      return this.currentBase ? this.currentBase.all : []
    },
    allPictures () {
      return Object.keys(this.all).map(id => this.all[id])
    },
    currentTag () {
      return this.$store.state.currentTag
    },
    perPage () {
      if (this.isStatic) {
        return 10
      } else {
        return 100
      }
    },
    currentPictures () {
      if (this.currentTag) {
        return this.currentBase ? this.currentBase.tagged[this.currentTag] : []
      } else {
        return this.allPictures.slice(0, this.perPage)
      }
    }
  },
  methods: {
    getSrc (picture) {
      const { path } = picture
      if (this.isStatic) {
        return `./web/${path}`
      } else {
        return `file:///${this.basePath}${path}`
      }
    }
  }
}
