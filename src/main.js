import Vue from 'vue'
import App from './App'
import router from './router'
import {i18n} from "./config/language"
import "./config/css"
import "./config/project"
import store from "./store"
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import ACard from "./components/common/libs/ACard/"
Vue.use(ElementUI, { locale })
Vue.use(ACard)
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})