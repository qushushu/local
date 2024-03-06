import power from "./config/power"
let config = {
    isWeb: true,  
    isPlant: false,
    isLocal: true,
    defaultLanguage: "zh",   // 程序默认语言
    power,
    // localRequestUrl: "http://10.0.0.20:3601/farm/",
    localRequestUrl: "http://192.168.153.128:3601/farm/",   // 本地请求地址
    webRequestUrl: "http://106.14.196.18:3801/cloud",  // 网络请求地址
    apiUrl: "http://106.14.196.18:3801/cloud"
}


export default config