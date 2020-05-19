const moment = require('moment');

function formatMessage(username,text){
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
};
//permet d'utiliser cette fonction dans server.js
module.exports = formatMessage;