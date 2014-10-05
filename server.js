require('./src/lib/promisifySuperagent.js');

var Fetcher = require('fetchr');
var Api = require('./src/lib/Api');
var tvshows = require('./src/api/tvshows');


// Fetcher.registerFetcher(require('./src/api/tvshows_fetchr'))
// var fetcher = new Fetcher({});
// var api = new Api(fetcher, 'tvshows');

// api.read({ error: false })
//     .then(console.log)
//     .catch(console.error);

tvshows.getSeries('Breaking Bad').then(function (result) {
    console.log(result);
});

