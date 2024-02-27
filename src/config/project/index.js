import json from "./config.js"

let {isPlant} = json;
location.search = isPlant ? "?m=plant" : "";