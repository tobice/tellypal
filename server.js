require('./src/lib/promisifySuperagent.js');

var Fetcher = require('fetchr');
var Api = require('./src/lib/Api');


Fetcher.registerFetcher(require('./src/api/tvshowsFetcher'))
var fetcher = new Fetcher({});
var tvshows = new Api(fetcher, 'tvshows');

tvshows.read({ search: 'Breaking Bad'})
    .then(console.log)
    .catch(console.error);

