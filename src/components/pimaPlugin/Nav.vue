<template lang="pug">
  div(class="pima-nav")
    table(class="pima-nav__table")
      tr
        td(style="text-align: left;")
          div(
            class="pima-nav__button",
            @click="onExplorerClick"
          )
            i(class="fas fa-th fa-3x")
          div(
            class="pima-nav__button",
            @click="onScalePlus"
          )
            i(class="fas fa-search-plus fa-3x")
          div(
            class="pima-nav__button",
            @click="onScaleMinus"
          )
            i(class="fas fa-search-minus fa-3x")
          div(
            class="pima-nav__button",
            @click="onScale"
          )
            i(class="fas fa-search fa-3x")
          div(
            class="pima-nav__item"
          ) {{ current.scale }}
          div(
            class="pima-nav__button",
            @click="onTags"
          )
            i(class="fas fa-tags fa-3x")
        td(style="text-align: right;")
          div(class="pima-nav__select")
            select(v-model='selectValue')
              option(
                v-for="n in pPageLength",
                :value="n - 1"
              ) {{ n }}
            span &nbsp;/&nbsp;
            span {{ pPageLength }}
    div(
      class="pima-nav__left",
      @click="onPre"
    )
      i(class="fas fa-arrow-circle-left fa-7x")
    div(
      class="pima-nav__right",
      @click="onNext"
    )
      i(class="fas fa-arrow-circle-right fa-7x")
</template>

<style lang="stylus">
  @import '~pima-components/style.styl'
  pima-nav-item()
    display inline-block
    vertical-align middle
    &:not(:first-child)
      margin-left 16px
  .pima-nav
    height 54px
  .pima-nav__table
    width 100%
    border-bottom $border
    background black
    position fixed
    top: 0
    left: 0
    z-index: 1
    td
      height 48px
      padding 0 16px
  .pima-nav__item
    pima-nav-item()
  .pima-nav__button
    pima-nav-item()
    cursor pointer
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
      }
    },
    computed: {
      selectValue: {
        get () {
          return this.pPage
        },
        set (page) {
          this.$emit('page', { page })
        }
      }
    },
    methods: {
      onExplorerClick () {
        this.$router.push('explorer')
      },
      onPre () {
        this.$emit('pre')
      },
      onNext () {
        this.$emit('next')
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
      onTags () {
        this.$router.push('tag-manage')
      }
    }
  }
</script>
