import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Content = (resolve) => {
  import('components/content/content').then((module) => {
    resolve(module)
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/content'
    },{
      path: '/content',
      component: Content
    }
  ]
})
