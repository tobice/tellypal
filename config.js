var moment = require('moment');

moment.locale('en', {
    calendar: {
        lastDay: '[Yesterday at] LT',
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        lastWeek: '[last] dddd [at] LT',
        nextWeek: 'dddd [at] LT',
        sameElse: 'LL'
    }
});

var config = {
    mongodbURI: 'mongodb://localhost/tellypal',
    downloadDir: '/home/tobik/downloads/torrents',
    deluge: {
        apiUrl: 'http://localhost:8112/json',
        password: 'deluge'
    }

};

module.exports = config;