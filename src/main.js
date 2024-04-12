import Vue from 'vue'
import App from './App'
import router from './router'
import {i18n} from "./config"
import "./config"
import store from "./store"
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import ACard from "./components/common/libs/ACard/"
/* 设置全局CSS start */
import {opinion} from "./assets/tools/tool.js"
import "./assets/base.css"
import "./assets/module.css"
if(opinion() === "mobile") {
    import("./assets/mobile-style.css")
}
/* 设置全局CSS end */
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