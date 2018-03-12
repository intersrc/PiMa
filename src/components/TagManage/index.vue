<template lang="pug">
  div
    pima-nav
    div(class="pima-tag-manage__container")
      //- pima-tags
      div(style="margin: 8px 0;")
        input(
          type="text",
          v-model="newTagName"
        )
        button(@click="onAddNew") Add New
      table(class="pima-tag-manage__parent-child")
        tr
          th name
          th weight
          th
        tr(v-for="tag in tagList")
          td {{ tag.name }}
          td
            input(
              type="number",
              step="1",
              :value="tag.weight",
              @change="onTagWeightChange($event, tag)"
            )
          td
            select(v-model='selectValues[tag.id]')
              template(v-for="t in tagList")
                option(
                  v-if="t.id !== tag.id && tag.children.indexOf(t.id) < 0",
                  :value="t.id"
                ) {{ t.name }}
            button(@click="onAddChild({ parentId: tag.id, childId: selectValues[tag.id] })") Add Child
</template>

<style lang="stylus">
  .pima-tag-manage__container
    text-align center
    margin-top 16px
  .pima-tag-manage__parent-child
    display inline-block
    td, th
      padding 4px
      text-align left
      &:first-child
        text-align right
</style>

<script>
  import mixin from 'pima-components/mixin'
  import * as aTypes from 'pima-store/actionTypes'
  import * as mTypes from 'pima-store/mutationTypes'

  export default {
    mixins: [mixin],
    data () {
      return {
        newTagName: '',
        selectValues: {}
      }
    },
    methods: {
      onAddNew () {
        if (this.newTagName) {
          this.$store.commit(mTypes.ADD_NEW_TAG, {
            name: this.newTagName
          })
          this.newTagName = ''
        }
      },
      onTagWeightChange (event, tag) {
        this.$store.commit(mTypes.SET_TAG_WEIGHT, {
          tagId: tag.id,
          weight: event.target.value
        })
      },
      onAddChild ({ parentId, childId }) {
        if (parentId && childId) {
          this.$store.commit(mTypes.ADD_CHILD_TAG, {
            parentId,
            childId
          })
          this.selectValues[parentId] = ''
        }
      },
      onReadTag () {
        this.$store.dispatch(aTypes.READ_TAGS)
      }
    }
  }
</script>
