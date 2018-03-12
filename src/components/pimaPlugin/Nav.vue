<template lang="pug">
  div(class="pima-nav")
    div(class="pima-nav__placeholder")
    table(class="pima-nav__table")
      tr
        td(style="text-align: left;")
          div(
            class="pima-nav__button",
            @click="onExplorerClick"
          )
            i(
              class="fas fa-th",
              :class="faSizeClass"
            )

          div(
            class="pima-nav__button",
            @click="onRefresh"
          )
            i(
              class="fas fa-sync-alt",
              :class="faSizeClass"
            )

          div(
            class="pima-nav__button",
            @click="onViewerClick"
          )
            i(
              class="fas fa-expand",
              :class="faSizeClass"
            )

          div(
            class="pima-nav__button",
            @click="onTags"
          )
            i(
              class="fas fa-tags",
              :class="faSizeClass"
            )

          div(
            class="pima-nav__button",
            @click="onScan"
          )
            i(
              class="fas fa-barcode",
              :class="faSizeClass"
            )

          div(
            class="pima-nav__button",
            @click="onScalePlus"
          )
            i(
              class="fas fa-search-plus",
              :class="faSizeClass"
            )

          div(
            class="pima-nav__button",
            @click="onScaleMinus"
          )
            i(
              class="fas fa-search-minus",
              :class="faSizeClass"
            )

          div(
            class="pima-nav__button",
            @click="onScale"
          )
            i(
              class="fas fa-search",
              :class="faSizeClass"
            )

          div(
            class="pima-nav__item"
          ) {{ current.scale }}

          div(
            class="pima-nav__button",
            :class="{ 'pima-nav__button--fade': !current.isHorizontalFlipped }"
            @click="onHorizontalFlip"
          )
            i(
              class="fas fa-arrows-alt-h",
              :class="faSizeClass"
            )

          div(
            class="pima-nav__button",
            @click="onPre"
          )
            i(
              class="fas fa-arrow-circle-left",
              :class="faSizeClass"
            )

          div(
            class="pima-nav__button",
            @click="onNext"
          )
            i(
              class="fas fa-arrow-circle-right",
              :class="faSizeClass"
            )

          div(
            class="pima-nav__button",
            @click="onRandom"
          )
            i(
              class="fas fa-random",
              :class="faSizeClass"
            )

          div(
            class="pima-nav__button",
            @click="onSave"
          )
            i(
              class="fas fa-save",
              :class="faSizeClass"
            )

          div(
            class="pima-nav__item"
          )
            slot

        td(style="text-align: right;")
          div(
            class="pima-nav__item"
          )
            select(v-model="sortSelectValue")
              option(
                v-for="key in ['birthtime', 'star', 'taggedTime', 'scannedTime']",
                :value="key"
              ) {{ key }}
          template(v-if="($route.path === '/' || $route.path === '/explorer')")
            div(
              class="pima-nav__item"
            )
              select(v-model="baseSelectValue")
                option(
                  value="-1"
                ) All
                option(
                  v-for="(base, index) in state.bases",
                  :value="index"
                ) {{ getBaseLabel(base) }}
          div(class="pima-nav__item")
            select(v-model="pageSelectValue")
              option(
                v-for="n in pPageLength",
                :value="n - 1"
              ) {{ n }}
            span &nbsp;/&nbsp;
            span {{ pPageLength }}
    div(class="pima-nav__tags-container")
      pima-tags(
        :checked-map="checkedMap",
        @tag-click="onTagClick"
      )
    //- div(
    //-   class="pima-nav__left",
    //-   @click="onPre"
    //- )
    //-   i(class="fas fa-arrow-circle-left fa-7x")
    //- div(
    //-   class="pima-nav__right",
    //-   @click="onNext"
    //- )
    //-   i(class="fas fa-arrow-circle-right fa-7x")
</template>

<style lang="stylus">
  @import '~pima-components/style.styl'
  $nav-height = 54px
  pima-nav-item()
    display inline-block
    vertical-align middle
    &:not(:first-child)
      margin-left 16px
  .pima-nav__placeholder
    height $nav-height
  .pima-nav__table
    width 100%
    border-bottom $border
    background black
    position fixed
    top 0
    left 0
    z-index 1
    td
      height 48px
      padding 0 16px
  .pima-nav__item
    pima-nav-item()
  .pima-nav__button
    pima-nav-item()
    cursor pointer
    border 2px solid transparent
    &:hover
      border-color grey
    &:active
      opacity 0.5
  .pima-nav__button--fade
    opacity 0.5
  .pima-nav__tags-container
    position fixed
    margin-top $nav-height
    top 0
    left 0
    text-align left
    padding 16px
    background-color rgba(0, 0, 0, 0.5)
    border-radius 8px
    max-height calc(100% - 86px) // 86 = $nav-height + padding * 2
    overflow-y auto
  .pima-nav__left, .pima-nav__right
    display inline-block
    position fixed
    top 50%
    margin-top -40px
    cursor pointer
    opacity 0.5
    transition all 0.3s
    &:hover
      opacity 1
  .pima-nav__left
    left 0
  .pima-nav__right
    right 0
</style>

<script>
  import mixin from 'pima-components/mixin'
  import * as aTypes from 'pima-store/actionTypes'
  import * as mTypes from 'pima-store/mutationTypes'

  export default {
    mixins: [mixin],
    props: {
      pPage: {
        type: Number,
        default: 1
      },
      pPageLength: {
        type: Number,
        default: 1
      },
      checkedMap: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    computed: {
      faSizeClass () {
        return 'fa-lg'
      },
      sortSelectValue: {
        get () {
          return this.current.sortKey
        },
        set (sortKey) {
          this.$store.commit(mTypes.SET_SORT_KEY, { sortKey })
        }
      },
      baseSelectValue: {
        get () {
          return this.current.baseIndex
        },
        set (baseIndex) {
          this.$store.commit(mTypes.SET_BASE, { baseIndex })
        }
      },
      pageSelectValue: {
        get () {
          return this.pPage
        },
        set (page) {
          this.$emit('page', { page })
        }
      }
    },
    mounted () {
      window.addEventListener('keydown', this.onWindowKeydown)
    },
    beforeDestroy () {
      window.removeEventListener('keydown', this.onWindowKeydown)
    },
    methods: {
      getBaseLabel (base) {
        const starNumber = base.tagged['15'] ? base.tagged['15'].length : 0
        const untaggedNumber = base.tagged['0'].length
        return `${base.path} | (u${untaggedNumber} ★${starNumber})`
      },
      onWindowKeydown (event) {
        switch (event.key) {
          case 'a':
          case 'ArrowLeft':
            this.onPre()
            break
          case 'd':
          case 'ArrowRight':
            this.onNext()
            break
          case 'w':
          case 'ArrowUp':
            this.onScaleMinus()
            break
          case 's':
          case 'ArrowDown':
            this.onScalePlus()
            break
          case 'Alt':
            this.onScale()
            break
          default:
            break
        }
      },
      onExplorerClick () {
        this.$router.push('explorer')
      },
      onViewerClick () {
        this.$router.push('viewer')
      },
      onPre () {
        this.$emit('pre')
      },
      onNext () {
        this.$emit('next')
      },
      onRandom () {
        this.$emit('random')
      },
      onScale () {
        this.$emit('scale')
      },
      onScalePlus () {
        this.$emit('scale-plus')
      },
      onScaleMinus () {
        this.$emit('scale-minus')
      },
      onHorizontalFlip () {
        this.$store.commit(mTypes.TOGGLE_HORIZONTAL_FLIPPED)
      },
      onTags () {
        this.$router.push('tag-manage')
      },
      onTagClick ({ tag }) {
        this.$emit('tag-click', { tag })
      },
      onSave () {
        this.$store.dispatch(aTypes.SAVE_CURRENT)
        this.$store.dispatch(aTypes.SAVE_ALL_BASES)
        this.$store.dispatch(aTypes.SAVE_TAGS)
      },
      onRefresh () {
        this.$store.commit(mTypes.UPDATE_CURRENT_PICTURES)
      },
      onScan () {
        if (this.isStatic) {
          this.$store.dispatch(aTypes.SCAN_BASE, { path: './web/' })
        } else {
          this.$router.push('scan')
        }
      }
    }
  }
</script>
