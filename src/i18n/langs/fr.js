let message = {}
for(item in languageList) {
    message[item]  = languageList[item].split("|")[1];
}
module.exports = {
    message
}