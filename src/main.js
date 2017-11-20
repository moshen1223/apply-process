import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'

import 'common/stylus/index.styl'

Vue.use(ElementUI)

Vue.config.productionTip = false

axios.interceptors.request.use(function(config){
    return config;
},function(error){
    return Promise.reject(error)
})

axios.interceptors.response.use(function(config){
    return config;
},function(error){
    return Promise.reject(error)
})

Vue.prototype.$http = axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
