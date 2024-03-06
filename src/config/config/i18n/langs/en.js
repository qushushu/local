let message = {}
for(item in languageList) {
    message[item]  = languageList[item].split("|")[0];
}
module.exports = {
    message
}