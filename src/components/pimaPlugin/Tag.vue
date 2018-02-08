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
      margin-top: 8px
  .pima-tag__container
    display inline-block
    border 2px solid
    border-radius 8px
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
