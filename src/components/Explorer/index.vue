<template lang="pug">
  div explorer
    img(
      v-for="p in currentPics",
      :src="`file:///${p}`"
    )
</template>

<style lang="stylus">
</style>

<script>
  export default {
    computed: {
      all () {
        return this.$store.state.all
      },
      currentPics () {
        return this.all.slice(0, 10)
      }
    }
  }
</script>
