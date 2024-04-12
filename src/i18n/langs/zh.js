let s = require("../../../static/language.txt")

let message = {}
for(item in languageList) {
    message[item]  = item;
}
module.exports = {
    message
}