import {opinion} from "./tool"
let default_url = "http://192.168.0.107";
let isMobile = opinion() == "mobile";
if(!isMobile) {default_url = window.ip.apiURL;}

function getWebUrl() {
	let baseUrl = isMobile ? (window.localStorage.apiurl || default_url) : default_url;
	baseUrl += "/farm";
	return baseUrl;
}

function getUrl() {
	return localMode ? "/apis" : getWebUrl();
}

export {getUrl};