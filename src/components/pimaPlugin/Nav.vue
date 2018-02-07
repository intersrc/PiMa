<template lang="pug">
  div(class="pima-nav")
    table(class="pima-nav__table")
      tr
        td(style="text-align: left;")
          div(
            class="pima-nav__explorer",
            @click="onExplorerClick"
          )
            i(class="fas fa-th fa-3x")
        td(style="text-align: right;")
          div(class="pima-nav__select")
            select(v-model='selectValue')
              option(
                v-for="n in pageLength",
                :value="n - 1"
              ) {{ n }}
            span &nbsp;/&nbsp;
            span {{ pageLength }}
    div(
      class="pima-nav__left",
      @click="onPre"
    )
      i(class="fas fa-arrow-circle-left fa-5x")
    div(
      class="pima-nav__right",
      @click="onNext"
    )
      i(class="fas fa-arrow-circle-right fa-5x")
</template>

<style lang="stylus">
  @import '~pima-components/style.styl'
  .pima-nav
    height 48px
  .pima-nav__table
    width: 100%
    border-bottom: $border
    td
      height: 48px
      padding: 0 8px
  .pima-nav__explorer
    display inline-block
    cursor pointer
  .pima-nav__left, .pima-nav__right
    display inline-block
    position fixed
    top 50%
    margin-top -40px
    cursor pointer
  .pima-nav__left
    left 0
  .pima-nav__right
    right 0
</style>

<script>
  import mixin from 'pima-components/mixin'

  export default {
    mixins: [mixin],
    props: {
      page: Number,
      pageLength: Number
    },
    computed: {
      selectValue: {
        get () {
          return this.page
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
      }
    }
  }
</script>
