<template lang="pug">
  div
    pima-nav
    div(class="pima-scan__container")
      select(v-model='basePath')
        option(
          v-for="(base, index) in state.bases",
          :value="state.bases[index].path"
        ) {{ state.bases[index].path }}
      button(@click="onScan") Scan
    div(class="pima-scan__container")
      button(@click="onScanAll") Scan All
    div(class="pima-scan__container")
      button(@click="onScanNew") Scan New
</template>

<style lang="stylus">
  .pima-scan__container
    text-align center
    margin-top 16px
</style>

<script>
  import mixin from 'pima-components/mixin'
  import * as aTypes from 'pima-store/actionTypes'

  export default {
    mixins: [mixin],
    data () {
      return {
        basePath: ''
      }
    },
    methods: {
      onScan () {
        if (this.basePath) {
          this.$store.dispatch(aTypes.SCAN_BASE, { path: this.basePath })
        }
      },
      onScanAll () {
        this.$store.dispatch(aTypes.SCAN_ALL_BASES)
      },
      onScanNew () {
        dialog.showOpenDialog({
          title: '选取扫描文件夹',
          properties: ['openDirectory', 'multiSelections', 'createDirectory']
        }, (filePaths) => {
          filePaths.forEach(filePath => {
            const path = `${filePath.replace(/\\/g, '/')}/`
            this.$store.dispatch(aTypes.SCAN_BASE, { path })
          })
        })
      }
    }
  }
</script>
