<template lang="pug">
  div(class="pima-tag")
    div(
      class="pima-tag__container",
      :style="tagStyle"
    ) {{ tag.name }}
    pima-tag(
      class="pima-tag__child",
      v-for="tagId in tag.children",
      :key="tagId",
      :checked-map="checkedMap",
      :tag="tags[tagId]"
    )
</template>

<style lang="stylus">
  @import '~pima-components/style.styl'
  .pima-tag
    &:not(:first-child)
      margin-top: 8px
  .pima-tag__container
    display inline-block
    border 1px solid
    border-radius 4px
    padding: 4px 8px
  .pima-tag__child
    margin-left: 32px
</style>

<script>
  import mixin from 'pima-components/mixin'

  export default {
    mixins: [mixin],
    props: {
      checkedMap: {
        type: Object,
        default: () => {
          return {}
        }
      },
      tag: {
        type: Object,
        default: () => {
          return {
            name: '?',
            color: '#fff'
          }
        }
      }
    },
    computed: {
      isChecked () {
        return this.checkedMap[this.tag.id]
      },
      tagStyle () {
        return {
          borderColor: this.tag.color,
          color: this.isChecked ? '#000' : this.tag.color,
          background: this.isChecked ? this.tag.color : 'transparent'
        }
      }
    }
  }
</script>
