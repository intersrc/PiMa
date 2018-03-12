<template lang="pug">
  div(class="pima-tag")
    div(
      class="pima-tag__container",
      :style="tagStyle",
      @click="onTagClick({ tag })"
    ) {{ tag.name }}
    pima-tag(
      class="pima-tag__child",
      v-for="tagId in tag.children",
      :key="tagId",
      :checked-map="checkedMap",
      :tag="tags[tagId]",
      @click="onChildrenClick"
    )
</template>

<style lang="stylus">
  @import '~pima-components/style.styl'
  .pima-tag
    cursor pointer
    &:not(:first-child)
      margin-top 4px
  .pima-tag__container
    display inline-block
    border 1px solid
    border-radius 4px
    font-size 12px
    padding 0 8px
    &:hover
      border-left-width 4px
      border-right-width 4px
      font-weight bold
    &:active
      opacity 0.5
  .pima-tag__child
    margin-left 16px
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
        const tagColor = this.tag.color || '#fff'
        return {
          borderColor: tagColor,
          color: this.isChecked ? '#000' : tagColor,
          background: this.isChecked ? tagColor : 'transparent'
        }
      }
    },
    methods: {
      onTagClick ({ tag }) {
        this.$emit('click', { tag })
      },
      onChildrenClick ({ tag }) {
        this.$emit('click', { tag })
      }
    }
  }
</script>
