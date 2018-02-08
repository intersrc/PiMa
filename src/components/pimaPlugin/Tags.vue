<template lang="pug">
  div(
    class="pima-tags"
  )
    pima-tag(
      v-for="tag in tags",
      :key="tag.id",
      :tag="tag",
      :checked-map="checkedMap"
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
    computed: {
      list () {
        const list = []
        for (const tagId in this.tags) {
          const tag = this.tags[tagId]
          list.push({
            ...tag,
            color: tag.color || '#fff',
            isChecked: this.checkedMap[tagId]
          })
        }
        return list
      }
    }
  }
</script>
