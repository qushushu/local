import power from "./config/power"
import {opinion} from "../assets/tools/tool"
let localRequestUrl = window.ip.apiURL;
opinion() == "mobile" && (localRequestUrl = localRequestUrl.replace(/\.[^\.]+:/,`.${localStorage.mobileReqPort}:`));
let config = {
    isWeb: false,   // 是否为网络版
    isPlant: false,  // 是否为种植
    localRequestUrl: `${localRequestUrl}/farm`,   // 本地版请求路径
    webRequestUrl: `${window.ip.webApiURL}/cloud`,  // 网络请求地址
    defaultLanguage: "zh",   // 程序默认语言
    power,
}
export default config