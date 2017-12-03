import Vue from 'vue'
import Router from 'vue-router'
import UploadTest from '@/components/UploadTest'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'UploadTest',
      component: UploadTest
    }
  ]
})
