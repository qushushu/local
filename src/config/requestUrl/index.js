import projectJson from "../project/config"
import requestUrl from "./config"
let {isWeb,isLocal} = projectJson;
let {localRequestUrl,webRequestUrl} = requestUrl;
let localBaseUrl;
if(isLocal) {
    localBaseUrl = "/apis"
} else {
    localBaseUrl = isWeb ? webRequestUrl : localRequestUrl;
}
export {localBaseUrl}