/* 说明：此模块用于控制系统语言 */
import Vue from 'vue'
import VueI18n from "vue-i18n"
import messages from "./i18n/messages"
Vue.use(VueI18n)
let locale = localStorage.locale ? localStorage.locale : "zh"
const i18n = new VueI18n({
  locale,
  messages
})
export {i18n}