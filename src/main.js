import Vue from 'vue'
import App from './App'
import './modules/commonSCSS/reset.scss'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import router from './router'

Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
