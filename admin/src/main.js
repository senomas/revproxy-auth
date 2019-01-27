import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)

import App from './App.vue'

Vue.config.productionTip = false
Vue.config.assetsSubDirectory = "/~auth"

new Vue({
  render: h => h(App),
}).$mount('#app')
