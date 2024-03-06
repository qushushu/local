import config from "./config"

/* 设置全局CSS start */
import {opinion} from "../assets/tools/tool.js"
import "../assets/base.css"
opinion() === "mobile" ? import("../assets/mobile-style.css") : import("../assets/pc.css");
/* 设置全局CSS end */

/* 种植地址跳转 start */
let {isPlant} = config;
if(isPlant) {
    location.search = "?m=plant"
} else {
    if(location.search.includes("?m=plant")) {
        location.search = ""
    }
}
/* 种植地址跳转 end */

/* 设置程序默认语言 start */
import Vue from 'vue'
import VueI18n from "vue-i18n"
import messages from "./config/i18n/messages"
Vue.use(VueI18n)
let locale = localStorage.locale ? localStorage.locale : config.defaultLanguage
const i18n = new VueI18n({
  locale,
  messages
})
export {i18n}
/* 设置程序默认语言 end */

/* 设置程序请求地址 start */
let {isWeb,isLocal,localRequestUrl,webRequestUrl} = config;
let localBaseUrl;
if(isLocal) {
    localBaseUrl = "/apis"
} else {
    localBaseUrl = isWeb ? webRequestUrl : localRequestUrl;
}
export {localBaseUrl}
/* 设置程序请求地址 end */

export default config