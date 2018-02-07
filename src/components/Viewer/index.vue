<template lang="pug">
  div(class="pima-viewer")
    pima-pagination(
      :page="0",
      :page-length="1"
    )
    img(:src="getSrc(currentPicture)")
</template>

<style lang="stylus">
  .pima-viewer
    text-align: center
</style>

<script>
  import mixin from 'pima-components/mixin'
  export default {
    mixins: [mixin]
  }
</script>
