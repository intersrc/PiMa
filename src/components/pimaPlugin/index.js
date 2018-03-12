import PimaLoading from './Loading'
import PimaNav from './Nav'
import PimaTag from './Tag'
import PimaTags from './Tags'

const components = {
  PimaLoading,
  PimaNav,
  PimaTag,
  PimaTags
}

const plugin = {
  install (Vue) {
    for (const key in components) {
      Vue.component(key, components[key])
    }
    // Vue.prototype.$foo = 'bar'
  }
}

export default plugin
