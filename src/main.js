// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import "./assets/base.css"
import {opinion} from "./assets/tools/tool.js"
if(opinion() === "mobile") {
  import ("./assets/mobile-style.css")
} else {
  import ("./assets/pc.css")
}
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
Vue.use(ElementUI, { locale })
import store from "./store"
import axios from 'axios'
import VueI18n from "vue-i18n"
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: "zh",  // 默认语言
  messages: {
    "zh": require("./i18n/langs/zh"),    // 引入语言包
    "en": require("./i18n/langs/en"),
    "fr": require("./i18n/langs/fr"),
  }
})
// 设置axios请求的token
axios.defaults.headers.common['token'] = '8eea162a4fbe0d4b4a92485d80a47bc4'
axios.defaults.headers.common['encrypt'] = 'false'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
