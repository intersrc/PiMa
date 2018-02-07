<template lang="pug">
  div(class="pima-pagination")
    div(class="pima-pagination__select")
      select(v-model='selectValue')
        option(
          v-for="n in pageLength",
          :value="n - 1"
        ) {{ n }}
      span &nbsp;/&nbsp;
      span {{ pageLength }}
    div(
      class="pima-pagination__left",
      @click="onPre"
    )
      i(class="fas fa-arrow-circle-left fa-5x")
    div(
      class="pima-pagination__right",
      @click="onNext"
    )
      i(class="fas fa-arrow-circle-right fa-5x")
</template>

<style lang="stylus">
  .pima-pagination__select
    padding 12px
    position absolute
    top 0
    width 100%
  .pima-pagination__left, .pima-pagination__right
    display inline-block
    position fixed
    top 50%
    margin-top -40px
    cursor pointer
  .pima-pagination__left
    left 0
  .pima-pagination__right
    right 0
</style>

<script>
  export default {
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
      onPre () {
        this.$emit('pre')
      },
      onNext () {
        this.$emit('next')
      }
    }
  }
</script>
