import Explorer from './components/Explorer'
import Scan from './components/Scan'
import TagManage from './components/TagManage'
import Viewer from './components/Viewer'

const routes = [{
  path: '/',
  component: Explorer
}, {
  path: '/explorer',
  component: Explorer
}, {
  path: '/scan',
  component: Scan
}, {
  path: '/tag-manage',
  component: TagManage
}, {
  path: '/viewer',
  component: Viewer
}]
export default routes
