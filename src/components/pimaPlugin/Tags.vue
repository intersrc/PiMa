<template lang="pug">
  div(
    class="pima-tags"
  )
    pima-tag(
      v-for="tag in tags",
      :key="tag.id",
      :tag="tag",
      :checked-map="checkedMap",
      @click="onTagClick"
    )
</template>

<style lang="stylus">
  @import '~pima-components/style.styl'
</style>

<script>
  import mixin from 'pima-components/mixin'
  import * as mTypes from 'pima-store/mutationTypes'

  export default {
    mixins: [mixin],
    props: {
      checkedMap: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    methods: {
      onTagClick ({ tag }) {
        this.$emit('tag-click', { tag })
      }
    }
  }
</script>
